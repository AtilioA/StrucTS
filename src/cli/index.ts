import chalk from 'chalk';
import { Command } from 'commander';
import { Model } from '../language-server/generated/ast';
import { StrucTsLanguageMetaData } from '../language-server/generated/module';
import { createStrucTsServices } from '../language-server/struc-ts-module';
import { extractAstNode } from './cli-util';
import { generateCommands } from './generator';
import { NodeFileSystem } from 'langium/node';
import { generateDot } from './dot_generator';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createStrucTsServices(NodeFileSystem).StrucTs;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateCommands(model, fileName, opts.destination);
    console.log(chalk.green(`TypeScript code generated successfully: ${generatedFilePath}`));
};

export const generateDotAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createStrucTsServices(NodeFileSystem).StrucTs;
    const model = await extractAstNode<Model>(fileName, services);
    const _generatedFilePath = generateDot(model, fileName, opts.destination);
    console.log(chalk.green(`Graphviz dot file generation is still WIP (${_generatedFilePath}), but input is well-formed: ${fileName}`));
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .version(require('../../package.json').version);

    const fileExtensions = StrucTsLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<StrucTS file>', `StrucTS source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'output directory for the TypeScript files')
        .description('generates TypeScript code from a StrucTS input file')
        .action(generateAction);

    program
    .command('generate-dot')
    .argument('<StrucTS file>', `StrucTS source file (possible file extensions: ${fileExtensions})`)
    .option('-d, --destination <dir>', 'output directory for the dot files')
    .description('generates a Graphviz dot file from a StrucTS input file')
    .action(generateDotAction);

    program.parse(process.argv);
}
