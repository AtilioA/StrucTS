import chalk from 'chalk';
import { Command } from 'commander';
import { NodeFileSystem } from 'langium/node';
import { type Model } from '../language-server/generated/ast';
import { StrucTsLanguageMetaData } from '../language-server/generated/module';
import { createStrucTsServices } from '../language-server/struc-ts-module';
import { extractAstNode } from './utils/cli-util';
import { generateTSFile } from './typescript_generator';
import { generateGVFile } from './dot_generator';

export const generateAction = async (fileName: string, options: GenerateOptions): Promise<void> => {
	const services = createStrucTsServices(NodeFileSystem).StrucTs;
	const model = await extractAstNode<Model>(fileName, services);

	const startTime = process.hrtime();
	const generatedFilePath = generateTSFile(model, fileName, options.destination);
	const endTime = process.hrtime(startTime);

	const executionTimeInMs = ((endTime[0] * 1e9) + endTime[1]) / 1e6;

	console.log(chalk.green(`TypeScript code generated successfully (took ${Math.round(executionTimeInMs)}ms): ${generatedFilePath}`));
};

export const generateDotAction = async (fileName: string, options: GenerateOptions): Promise<void> => {
	const services = createStrucTsServices(NodeFileSystem).StrucTs;
	const model = await extractAstNode<Model>(fileName, services);
	const generatedFilePath = generateGVFile(model, fileName, options.destination);
	console.log(chalk.green(`Graphviz .gv file generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
	destination?: string;
};

export function entrypoint(): void {
	const program = new Command();

	program
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
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
