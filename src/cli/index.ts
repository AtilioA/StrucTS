import chalk from 'chalk';
import { Command } from 'commander';
import { NodeFileSystem } from 'langium/node';
import { type Model } from '../language-server/generated/ast';
import { StrucTsLanguageMetaData } from '../language-server/generated/module';
import { createStrucTsServices } from '../language-server/struc-ts-module';
import { extractAstNode } from './cli-util';
import { generateCommands } from './typescript_generator';
import { generateCommands as generateDot } from './dot_generator';

export const generateAction = async (fileName: string, options: GenerateOptions): Promise<void> => {
	const services = createStrucTsServices(NodeFileSystem).StrucTs;
	const model = await extractAstNode<Model>(fileName, services);
	const generatedFilePath = generateCommands(model, fileName, options.destination);
	console.log(chalk.green(`TypeScript code generated successfully: ${generatedFilePath}`));
};

export const generateDotAction = async (fileName: string, options: GenerateOptions): Promise<void> => {
	const services = createStrucTsServices(NodeFileSystem).StrucTs;
	const model = await extractAstNode<Model>(fileName, services);
	const generatedFilePath = generateDot(model, fileName, options.destination);
	console.log(chalk.green(`Graphviz dot file generated successfully (WIP): ${generatedFilePath}`));
};

export type GenerateOptions = {
	destination?: string;
};

export function entrypoint(): void {
	const program = new Command();

	program
		.version(require('../../package.json').version);

	const fileExtensions = StrucTsLanguageMetaData.fileExtensions.join(', ');
	program
		.command('generate')
		.argument('<StrucTS file>', `StrucTS source file (possible file extensions: ${fileExtensions})`)
		.option('-d, --destination <dir>', 'output directory for the TypeScript files')
		.description('generates TypeScript code from a StrucTS input file')
		.action(generateAction);

	program
		.command('generate-graphviz')
		.description('Generates a GraphViz representation of a StrucTS file')
		.argument('<StrucTS file>', `StrucTS source file (possible file extensions: ${fileExtensions})`)
		.option('-d, --destination <dir>', 'output directory for the dot files')
		.action(generateDotAction);

	program.parse(process.argv);
}
