import { NL, IndentNode, CompositeGeneratorNode } from 'langium';
import { isProperty, type Class, type Property, isComposedProperty, isAttributeProperty } from '../../language-server/generated/ast';
import { convertToPascalCase } from '../utils/strings';

function getClassObjectName(cls: Class): string {
	return cls.name.toLowerCase();
}

function generateBuilderConstructor(): IndentNode {
	const constructorNode = new IndentNode();
	constructorNode.append('constructor() {', NL);

	const bodyNode = new IndentNode();
	bodyNode.append('this.reset();', NL);

	constructorNode.append(bodyNode);

	constructorNode.append('}', NL);

	return constructorNode;
}

// Generate the reset method
function generateResetMethod(cls: Class): IndentNode {
	const resetMethodNode = new IndentNode();
	resetMethodNode.append('public reset(): void {', NL);

	// Assign a new cls.name object to this.getClassObjectName(cls). Call it with all the attribute properties as parameters
	const bodyNode = new IndentNode();
	bodyNode.append('this.', getClassObjectName(cls), ' = new ', cls.name, '(');
	// FIXME: parameters are not needed; just call the constructor. However, we need to create constructors that do not require parameters.
	// const attributeProperties = cls.statements.filter(statement => isProperty(statement) && isAttributeProperty(statement));
	// const attributePropertyNames = attributeProperties.map(property => property.name);
	// bodyNode.append(attributePropertyNames.join(', '));
	bodyNode.append(');', NL);

	resetMethodNode.append(bodyNode);

	resetMethodNode.append('}', NL);

	return resetMethodNode;
}

// Generate the Builder method
function generateBuilderMethod(cls: Class, property: Property): IndentNode | null {
	const methodNode = new IndentNode();
	if (isComposedProperty(property)) {
		methodNode.append('public add', convertToPascalCase(property.name), '(', property.name, ': ', property.type.class.ref?.name, '): ', cls.name, 'Builder {', NL);
	} else if (isAttributeProperty(property)) {
		methodNode.append('public add', convertToPascalCase(property.name), '(', property.name, ': ', property.type, '): ', cls.name, 'Builder {', NL);
	} else {
		methodNode.append('public add', convertToPascalCase(property.name), '(', property.name, ': ', property.type.class.ref?.name, '): ', cls.name, 'Builder {', NL);
	}

	if (property.cardinality) {
		methodNode.append('// FIXME: add element with CustomCollection API', NL);
	}

	// Method body
	const bodyNode = new IndentNode();
	bodyNode.append('this.', getClassObjectName(cls), '.', property.name, ' = ', property.name, ';', NL);
	bodyNode.append('return this;', NL);
	methodNode.append(bodyNode);

	methodNode.append('}', NL);

	return methodNode;
}

// Generate the Build method
function generateBuildMethod(cls: Class): IndentNode {
	const buildMethodNode = new IndentNode();
	buildMethodNode.append('public build(): ', cls.name, ' {', NL);

	// Method body
	const bodyNode = new IndentNode();

	bodyNode.append(`const result = this.${getClassObjectName(cls)};`, NL);
	bodyNode.append('this.reset();', NL);
	bodyNode.append('// Reset the builder so it can be used to build another object', NL);
	bodyNode.append('return result;', NL);

	buildMethodNode.append(bodyNode);

	buildMethodNode.append('}', NL);

	return buildMethodNode;
}

export function generateBuilderClass(cls: Class): CompositeGeneratorNode {
	const builderClassNode = new CompositeGeneratorNode();

	// Builder Class header
	builderClassNode.append(NL, 'export class ', cls.name, 'Builder {', NL);

	// Add a private property for the class object instance being built
	const classInstanceNode = new IndentNode();
	classInstanceNode.append('private ', getClassObjectName(cls), ' = new ', cls.name, '();', NL, NL);
	builderClassNode.append(classInstanceNode);

	// Generate the constructor
	builderClassNode.append(generateBuilderConstructor(), NL);

	// Generate the reset method
	builderClassNode.append(generateResetMethod(cls), NL);

	// // Builder Class attributes, same as the original class
	// for (const property of cls.statements.filter(statement => isProperty(statement))) {
	// 	const propertyNode = generateProperty(property as Property);
	// 	builderClassNode.append(propertyNode, NL);
	// }

	// Builder methods
	for (const property of cls.statements.filter(statement => isProperty(statement))) {
		const methodNode = generateBuilderMethod(cls, property as Property);
		if (methodNode) {
			builderClassNode.append(methodNode, NL);
		}
	}

	// Build Method
	const buildMethodNode = generateBuildMethod(cls);
	builderClassNode.append(buildMethodNode, NL);

	// Builder Class 'footer'
	builderClassNode.append('}', NL);

	return builderClassNode;
}
