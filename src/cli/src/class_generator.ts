import { type GeneratorNode, CompositeGeneratorNode, NL, IndentNode } from 'langium';
import { type Class, type Property, isProperty, type ComposedProperty, type AttributeProperty, type ReferenceProperty, isComposedProperty, isAttributeProperty, isReferenceProperty, isReferencingProperty } from '../../language-server/generated/ast';
import { hasClassImplementedFactory } from '../utils/model_checks';
import { createCollectionString } from '../utils/strings';

function generateFactoryClass(cls: Class): CompositeGeneratorNode {
	function createFactoryConstructor(cls: Class): CompositeGeneratorNode {
		const constructorNode = new IndentNode();

		// Modularized function for collecting property names as parameters
		const parameters = getPropertyParameters(cls);

		// Method signature with parameters
		constructorNode.append(`create${cls.name}(${parameters}) {`, NL);

		// Method body
		const bodyNode = new IndentNode();
		const argumentList = cls.statements
			.filter(statement => isProperty(statement) && !isReferencingProperty(statement))
			.map(prop => prop.name)
			.join(', ');
		bodyNode.append(`return new ${cls.name}(${argumentList});`, NL);
		constructorNode.append(bodyNode);

		constructorNode.append('}', NL);

		return constructorNode;
	}

	const factoryClassName = `${cls.name}Factory`;
	const factoryClassHeader = `export class ${factoryClassName} {\n`;
	const factoryClassFooter = '}';

	const factoryClass = new CompositeGeneratorNode(NL);

	factoryClass.append(getFactoryClassComment(cls.name));
	factoryClass.append(factoryClassHeader);

	// Iterate through the properties of the class and generate code for each property
	const classScope = new IndentNode();
	for (const statement of cls.statements) {
		if (isProperty(statement)) {
			const propertyNode = generateProperty(statement);
			classScope.append(propertyNode, NL);
		}
	}

	classScope.append(NL);

	factoryClass.append(classScope);

	factoryClass.append(createFactoryConstructor(cls));

	factoryClass.append(factoryClassFooter, NL);

	return factoryClass;
}

function getFactoryClassComment(className: string): string {
	return `/**
* The ${className}Factory is responsible for creating new ${className} instances.
*/
`;
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

export function generateComposedProperty(property: ComposedProperty): GeneratorNode {
	const propertyNode = new CompositeGeneratorNode();

	propertyNode.append(property.name, ': ');
	// FIXME: managing composition is needed
	if (property.cardinality) {
		propertyNode.append('CustomCollection<', property.type.class.ref?.name, '>');
	} else {
		propertyNode.append(property.type.class.ref?.name);
	}

	propertyNode.append(';');

	return propertyNode;
}

export function generateAttributeProperty(property: AttributeProperty): GeneratorNode {
	const propertyNode = new CompositeGeneratorNode();

	propertyNode.append(property.name, ': ');
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

	propertyNode.append(property.name, ': ');
	if (property.cardinality) {
		propertyNode.append('CustomCollection<', property.type.class.ref?.name, '>');
	} else {
		propertyNode.append(property.type.class.ref?.name);
	}

	propertyNode.append(';');

	return propertyNode;
}

export function generateClassConstructor(cls: Class): IndentNode {
	const classConstructor = new IndentNode();

	// Method signature with parameters
	const constructorParameters = getPropertyParameters(cls);
	classConstructor.append(NL, `constructor(${constructorParameters}) {`, NL);

	// Constructor body (assigning parameters to properties)
	const bodyNode = new IndentNode();
	const properties = cls.statements.filter(statement => isProperty(statement));

	for (const property of properties) {
		if (isProperty(property)) {
			if (property.cardinality) {
				bodyNode.append(`this.${property.name} = ${createCollectionString(property)}`, NL);
			} else {
				bodyNode.append(`this.${property.name} = ${property.name};`, NL);
			}
		}
	}

	classConstructor.append(bodyNode);

	classConstructor.append('}', NL);

	return classConstructor;
}

export function generateClass(cls: Class): CompositeGeneratorNode {
	const classGeneratorNode = new CompositeGeneratorNode();

	// Class header
	classGeneratorNode.append('export class ', cls.name, ' {', NL);

	// Iterate through the properties of the class and generate code for each property
	const classAttributes = new IndentNode();
	const classProperties = cls.statements.filter(statement => isProperty(statement));

	for (const property of classProperties as Property[]) {
		const propertyNode = generateProperty(property);
		classAttributes.append(propertyNode, NL);
	}

	classGeneratorNode.append(classAttributes);

	const classConstructor = generateClassConstructor(cls);

	classGeneratorNode.append(classConstructor);

	// TODO: Add destroy method. If there is composition, destroy the items in the collection

	// Class 'footer'
	classGeneratorNode.append('}', NL);

	if (hasClassImplementedFactory(cls)) {
		classGeneratorNode.append(generateFactoryClass(cls));
	}

	return classGeneratorNode;
}
