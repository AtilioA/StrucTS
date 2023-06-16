import fs from 'node:fs';
import path from 'node:path';
import { CompositeGeneratorNode, IndentNode, NL, toString } from 'langium';
import { type Model, isClass } from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';
import { generateAssociations, generateGraphvizClass } from './src/graphviz/class_generator';

export function generateDot(model: Model): string {
	const fileNode = new CompositeGeneratorNode();

	fileNode.append('digraph G {', NL);

	const digraphBodyNode = new IndentNode();
	digraphBodyNode.append('node [shape=record, style=filled, fillcolor=gray95]', NL);
	digraphBodyNode.append('edge [color=gray50]', NL, NL);

	// Iterate through the top-level elements in the Model (AST)
	for (const element of model.elements) {
		if (isClass(element)) {
			const classNode = generateGraphvizClass(element);
			digraphBodyNode.append(classNode);
		}

		if (element !== model.elements[model.elements.length - 1]) {
			digraphBodyNode.append(NL);
		}
	}

	fileNode.append(digraphBodyNode);

	fileNode.append(generateAssociations(model));

	fileNode.append('}', NL);

	return toString(fileNode);
}

export function generateCommands(model: Model, filePath: string, destination: string | undefined): string {
	const data = extractDestinationAndName(filePath, destination);
	const generatedFilePath = `${path.join(data.destination, data.name)}.gv`;

	if (!fs.existsSync(data.destination)) {
		fs.mkdirSync(data.destination, { recursive: true });
	}

	const result = generateDot(model);

	fs.writeFileSync(generatedFilePath, result);

	return generatedFilePath;
}
