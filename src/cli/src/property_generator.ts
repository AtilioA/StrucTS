import { type GeneratorNode, CompositeGeneratorNode, NL, IndentNode } from 'langium';
import { type ComposedProperty, type AttributeProperty, type ReferenceProperty, type Property, isComposedProperty, isAttributeProperty, isReferenceProperty, type Class, isProperty } from '../../language-server/generated/ast';
import { makeFirstLetterUpperCase } from '../utils/strings';

export function generateComposedProperty(property: ComposedProperty): GeneratorNode {
	const propertyNode = new CompositeGeneratorNode();

	// FIXME: managing composition is needed
	if (property.cardinality) {
		// REVIEW: maybe this should not be readonly
		propertyNode.append('private readonly ', property.name, ': ');
		propertyNode.append('CustomCollection<', property.type.class.ref?.name, '>');
	} else {
		propertyNode.append('public', property.name, ': ');
		propertyNode.append(property.type.class.ref?.name);
	}

	propertyNode.append(';');

	return propertyNode;
}

export function generateAttributeProperty(property: AttributeProperty): GeneratorNode {
	const propertyNode = new CompositeGeneratorNode();

	propertyNode.append('public ', property.name, ': ');
	if (property.cardinality) {
		propertyNode.append('CustomCollection<', property.type, '>');
	} else {
		propertyNode.append(property.type);
	}

	propertyNode.append(';');

	return propertyNode;
}

export function generateReferenceProperty(property: ReferenceProperty): GeneratorNode {
	const propertyNode = new CompositeGeneratorNode();

	if (property.cardinality) {
		propertyNode.append('private readonly ', property.name, ': ');
		propertyNode.append('CustomCollection<', property.type.class.ref?.name, '>');
	} else {
		propertyNode.append('public', property.name, ': ');
		propertyNode.append(property.type.class.ref?.name);
	}

	propertyNode.append(';');

	return propertyNode;
}

export function generateProperty(property: Property): GeneratorNode {
	const propertyNode = new CompositeGeneratorNode();

	if (isComposedProperty(property)) {
		propertyNode.append(generateComposedProperty(property));
	} else if (isAttributeProperty(property)) {
		propertyNode.append(generateAttributeProperty(property));
	} else if (isReferenceProperty(property)) {
		propertyNode.append(generateReferenceProperty(property));
	}

	return propertyNode;
}

export function getPropertyParameters(cls: Class): string {
	const properties = cls.statements.filter(
		statement => isProperty(statement) && !statement.cardinality,
	);
	return properties
		.map(prop => {
			// NOTE: many of these checks are a bit redundant because of the filter above
			if (isComposedProperty(prop)) {
				return `${prop.name}: ${prop.type.class.ref?.name}`;
			} else if (isAttributeProperty(prop)) {
				return `${prop.name}: ${prop.type}`;
			} else if (isReferenceProperty(prop)) {
				return `${prop.name}: ${prop.type.class.ref?.name}`;
			} else {
				return '';
			}
		})
		.filter(Boolean)
		.join(', ');
}

export function generateCollectionInterface(cls: Class): CompositeGeneratorNode {
	// function generateGetters(property) {}
	const getterNode = new CompositeGeneratorNode();

	const properties = cls.statements.filter(statement => isProperty(statement));
	if (properties.length > 0) {
		const commentNode = new IndentNode();
		commentNode.append('/* StrucTS: Accessors/modifiers for private CustomCollection properties */');
		getterNode.append(commentNode, NL);
	}

	for (const property of properties) {
		if (isProperty(property)) {
			const getter = new IndentNode();
			if (property.cardinality) {
				getter.append('public get', makeFirstLetterUpperCase(property.name), '(): ');
				if (isComposedProperty(property) || isReferenceProperty(property)) {
					getter.append(makeFirstLetterUpperCase(property.type.class.ref?.name), '[]');
				} else {
					getter.append(property.type, '[]');
				}

				getter.append(' {', NL);

				getter.append('return this.', property.name, '.getItems();', NL);
				// getter.append('return this.', property.name, ';', NL);

				getter.append('}', NL);

				if (isComposedProperty(property) || isReferenceProperty(property)) {
					getter.append('public add', makeFirstLetterUpperCase(property.name), `(addItem: ${property.type.class.ref?.name}): void { `, NL);
				}

				getter.append('this.', property.name, '.add(addItem);', NL);
				// getter.append('return this.', property.name, ';', NL);

				getter.append('}', NL);

				if (isComposedProperty(property) || isReferenceProperty(property)) {
					getter.append('public remove', makeFirstLetterUpperCase(property.name), `(removeItem: ${property.type.class.ref?.name}): void { `, NL);
				}

				getter.append('this.', property.name, '.remove(removeItem);', NL);
				// getter.append('return this.', property.name, ';', NL);

				getter.append('}', NL);

				// Add newline if not last getter
				getterNode.append(getter, NL);
			}
		}
	}

	return getterNode;
}
