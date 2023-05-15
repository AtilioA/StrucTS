import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { type GeneratorNode, CompositeGeneratorNode, NL, toString, IndentNode } from 'langium';
import { type Class, type Model, type Property, isClass, isProperty, type ComposedProperty, type AttributeProperty, type ReferenceProperty, isComposedProperty, isAttributeProperty, isReferenceProperty } from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';
import { appendImports } from './utils/fs-utils';
import { hasClassImplementedFactory } from './utils/model_checks';

// Function generateFactoryClass(cls: Class): GeneratorNode {
//     const factoryClassName = `${cls.name}Factory`;
//     const factoryClassHeader = `class ${factoryClassName} {\n`;
//     const factoryClassFooter = `}\n\n`;
//     // const classProperties = getClassProperties(cls);
//     // const classMethods = getClassMethods(cls);

//     let factoryClass = new CompositeGeneratorNode();
//     factoryClass.append(getFactoryClassComment(factoryClassName));
//     factoryClass.append(factoryClassHeader);
//       // Iterate through the properties of the class and generate code for each property
//   for (const statement of cls.statements) {
//     if (isProperty(statement)) {
//         const propertyNode = generateProperty(statement);
//         factoryClass.append(propertyNode, NL);
//     }
//   }
//     factoryClass.append(factoryClassFooter);

//     return factoryClass;
// }

// function getFactoryClassComment(className: string): string {
// return `/**
// * The ${className}Factory is responsible for creating new ${className} instances.
// */
// `;
// }

function generateProperty(property: Property): GeneratorNode {
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

function generateComposedProperty(property: ComposedProperty): GeneratorNode {
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

function generateAttributeProperty(property: AttributeProperty): GeneratorNode {
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

function generateReferenceProperty(property: ReferenceProperty): GeneratorNode {
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

function generateClass(cls: Class): CompositeGeneratorNode {
	const classGeneratorNode = new CompositeGeneratorNode();

	// Class header
	classGeneratorNode.append('export class ', cls.name, ' {', NL);

	// Iterate through the properties of the class and generate code for each property
	const classScope = new IndentNode();
	for (const statement of cls.statements) {
		if (isProperty(statement)) {
			const propertyNode = generateProperty(statement);
			classScope.append(propertyNode, NL);
		}
	}

	classGeneratorNode.append(classScope);

	// TODO: Add destroy method. If there is composition, destroy the items in the collection

	// Class 'footer'
	classGeneratorNode.append('}', NL);

	if (hasClassImplementedFactory(cls)) {
		// ClassGeneratorNode.append(generateFactoryClass(cls));
	}

	return classGeneratorNode;
}

export function generateTypeScript(model: Model, filePath: string, destination: string | undefined): string {
	const fileNode = new CompositeGeneratorNode();

	appendImports(fileNode, model, destination);

	// Iterate through the top-level elements in the Model (AST)
	for (const element of model.elements) {
		if (isClass(element)) {
			const classNode = generateClass(element);
			fileNode.append(classNode, NL);
		}
	}

	return toString(fileNode);
}

export function generateCommands(model: Model, filePath: string, destination: string | undefined): string {
	const data = extractDestinationAndName(filePath, destination);
	const generatedFilePath = `${path.join(data.destination, data.name)}.ts`;

	if (!fs.existsSync(data.destination)) {
		fs.mkdirSync(data.destination, { recursive: true });
	}

	const result = generateTypeScript(model, filePath, destination);

	fs.writeFileSync(generatedFilePath, result);

	const temporaryIgnorePath = path.join(__dirname, 'temp.eslintignore');
	fs.writeFileSync(temporaryIgnorePath, ''); // Write an empty .eslintignore file

	// Run ESLint at the end of the generation process
	try {
		execSync(`npx xo ${data.destination} --fix --space --ignore-path=${temporaryIgnorePath}`, { stdio: 'inherit' });
	} catch (error) {
		console.error('ESLint execution failed:', error);
	} finally {
		fs.unlinkSync(temporaryIgnorePath); // Delete the temporary .eslintignore file
	}

	return generatedFilePath;
}
