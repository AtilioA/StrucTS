import { CompositeGeneratorNode, NL, IndentNode } from 'langium';
import { type Class, type Property, isProperty, isComposedProperty, isMethod, type Model, isClass } from '../../language-server/generated/ast';
import { type IImplementedInterfaces, getImplementedInterfaces, isComposedInOtherClasses } from '../utils/model_checks';
import { createCollectionString } from '../utils/strings';
import { generateBuilderClass } from './builder_generator';
import { generateCollectionInterface, generateProperty, getPropertyParameters } from './property_generator';
import { generateFactoryClass } from './factory_generator';

export function generateDestroy(cls: Class, model: Model): IndentNode {
	const destroyNode = new IndentNode();

	const hasComposition = cls.statements.some(statement => isComposedProperty(statement));
	const isComposedInOthers = isComposedInOtherClasses(cls, model);

	// Check if we should generate a destroy method
	if (hasComposition || isComposedInOthers) {
		destroyNode.append(`/* StrucTS: Add any cleanup logic specific to the ${cls.name} class here */`, NL);
		destroyNode.append('public destroy(): void {', NL);

		const destroyBody = new IndentNode();

		if (isComposedInOthers) {
			// If this class is composed in any other class, 'add additional logic here'
			destroyBody.append(`console.log('${cls.name} instance is being destroyed.')`, NL);
		}

		// If the class has composition, destroy composed items
		if (hasComposition) {
			const properties = cls.statements.filter(statement => isProperty(statement));
			// Iterate through class properties to find collections
			for (const property of properties) {
				if (isComposedProperty(property)) {
					const propertyName = property.name;
					const destroyComposedBody = new IndentNode();

					destroyBody.append(`for (const item of this.${propertyName}.getItems()) {`, NL);
					destroyComposedBody.append('item.destroy();', NL);
					destroyBody.append(destroyComposedBody);
					destroyBody.append('}', NL);
				}
			}
		}

		destroyNode.append(destroyBody, '}', NL);
	}

	return destroyNode;
}

export function generateClassConstructor(cls: Class, implementedInterfaces: IImplementedInterfaces): IndentNode {
	const classConstructor = new IndentNode();

	// Method signature with parameters
	const constructorParameters = getPropertyParameters(cls);

	const bodyNode = new IndentNode();
	if (implementedInterfaces.Builder) {
		classConstructor.append('constructor() {', NL);

		// REFACTOR: move this to a separate function
		for (const property of cls.statements.filter(statement => isProperty(statement))) {
			if ((property as Property).cardinality && !isMethod(property)) {
				bodyNode.append(`this.${property.name} = ${createCollectionString(property)}`, NL);
			}
		}

		bodyNode.append('return this;', NL);
	} else {
		classConstructor.append(`constructor(${constructorParameters}) {`, NL);

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
	classConstructor.append('}', NL, NL);

	return classConstructor;
}

export function generateClass(cls: Class, model: Model): CompositeGeneratorNode {
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

	const classConstructor = generateClassConstructor(cls, implementedInterfaces);
	classGeneratorNode.append(classConstructor);

	const classCollectionsInterfaces = generateCollectionInterface(cls);
	classGeneratorNode.append(classCollectionsInterfaces);

	const classDestroyMethod = generateDestroy(cls, model);
	classGeneratorNode.append(classDestroyMethod);

	// Class 'footer'
	classGeneratorNode.append('}', NL);

	if (implementedInterfaces.Factory && implementedInterfaces.Builder) {
		// Left for future implementation, if desired
	} else if (implementedInterfaces.Factory) {
		const factoryClass = generateFactoryClass(cls);
		classGeneratorNode.append(factoryClass);
	} else if (implementedInterfaces.Builder) {
		const builderClass = generateBuilderClass(cls);
		classGeneratorNode.append(builderClass);
	}

	return classGeneratorNode;
}

export function generateClasses(model: Model): CompositeGeneratorNode {
	const classesNode = new CompositeGeneratorNode();

	// Iterate through the top-level elements in the Model (AST)
	for (const element of model.elements) {
		if (isClass(element)) {
			const classNode = generateClass(element, model);
			classesNode.append(classNode, NL);
		}
	}

	return classesNode;
}
