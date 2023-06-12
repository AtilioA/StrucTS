import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import { type Model, isClass } from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';
import { appendImports } from './utils/fs-utils';
import { generateClass } from './src/class_generator';

export function generateTypeScript(model: Model, destination: string | undefined): string {
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

	const result = generateTypeScript(model, destination);

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
