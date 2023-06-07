import { type GeneratorNode, CompositeGeneratorNode } from 'langium';
import { type ComposedProperty, type AttributeProperty, type ReferenceProperty, type Property, isComposedProperty, isAttributeProperty, isReferenceProperty, type Class, isProperty } from '../../language-server/generated/ast';

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
