import fs from 'fs';
import { GeneratorNode, CompositeGeneratorNode, NL, toString } from 'langium';
import path from 'path';
import { Class, Model, isClass } from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';

// Stub generateProperty function
export function generateProperty(property: unknown): GeneratorNode {
    return new CompositeGeneratorNode();
}

export function generateClass(cls: Class): CompositeGeneratorNode {
  const classNode = new CompositeGeneratorNode();

  // Class header
  classNode.append("export class ", cls.name, " {", NL);

  // Iterate through the properties of the class and generate code for each property
  for (const property of cls.properties) {
    // const propertyNode = generateProperty(property);
    classNode.append(property.name, NL);
  }

  // Class 'footer'
  classNode.append("}", NL);

  return classNode;
}

export function generateTypeScript(model: Model, filePath: string, destination: string | undefined): string {
    const fileNode = new CompositeGeneratorNode();
    fileNode.append('"use strict";', NL, NL);

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
    return generatedFilePath;
}
