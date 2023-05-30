import { CompositeGeneratorNode, NL, IndentNode } from 'langium';
import { type Class, isProperty, isReferencingProperty } from '../../language-server/generated/ast';
import { generateProperty, getPropertyParameters } from './property_generator';

function generateFactoryClassDoc(className: string): string {
	return `/**
* StrucTS: The ${className}Factory is responsible for creating new ${className} instances.
*/
`;
}

export function generateFactoryClass(cls: Class): CompositeGeneratorNode {
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

	factoryClass.append(generateFactoryClassDoc(cls.name));
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
