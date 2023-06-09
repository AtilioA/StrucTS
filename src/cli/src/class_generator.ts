import { CompositeGeneratorNode, NL, IndentNode } from 'langium';
import { type Class, type Property, isProperty } from '../../language-server/generated/ast';
import { type IImplementedInterfaces, getImplementedInterfaces } from '../utils/model_checks';
import { createCollectionString } from '../utils/strings';
import { generateBuilderClass } from './builder_generator';
import { generateCollectionInterface, generateProperty, getPropertyParameters } from './property_generator';
import { generateFactoryClass } from './factory_generator';

export function generateClassConstructor(cls: Class, implementedInterfaces: IImplementedInterfaces): IndentNode {
	const classConstructor = new IndentNode();

	// Method signature with parameters
	const constructorParameters = getPropertyParameters(cls);

	const bodyNode = new IndentNode();
	if (implementedInterfaces.Builder) {
		classConstructor.append('constructor() {', NL);
		bodyNode.append('return this;', NL);
	} else {
		classConstructor.append(NL, `constructor(${constructorParameters}) {`, NL);

		// Constructor body (assigning parameters to properties)
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
	}

	classConstructor.append(bodyNode);
	classConstructor.append('}', NL);

	return classConstructor;
}

export function generateClass(cls: Class): CompositeGeneratorNode {
	const classGeneratorNode = new CompositeGeneratorNode();

	const implementedInterfaces = getImplementedInterfaces(cls);

	// Class header
	classGeneratorNode.append('export class ', cls.name, ' {', NL);

	// Iterate through the properties of the class and generate code for each property
	const classAttributes = new IndentNode();
	const classProperties = cls.statements.filter(statement => isProperty(statement));

	for (const property of classProperties as Property[]) {
		const propertyNode = generateProperty(property);
		classAttributes.append(propertyNode, NL);
	}

	classAttributes.append(NL);

	classGeneratorNode.append(classAttributes);

	const collectionInterfaces = generateCollectionInterface(cls);
	classGeneratorNode.append(collectionInterfaces);

	const classConstructor = generateClassConstructor(cls, implementedInterfaces);

	classGeneratorNode.append(classConstructor);

	// TODO: Add destroy method. If there is composition, destroy the items in the collection

	// Class 'footer'
	classGeneratorNode.append('}', NL);

	if (implementedInterfaces.Factory && implementedInterfaces.Builder) {
		// ...
	} else if (implementedInterfaces.Factory) {
		const factoryClass = generateFactoryClass(cls);
		classGeneratorNode.append(factoryClass);
	} else if (implementedInterfaces.Builder) {
		const builderClass = generateBuilderClass(cls);
		classGeneratorNode.append(builderClass);
	}

	return classGeneratorNode;
}
