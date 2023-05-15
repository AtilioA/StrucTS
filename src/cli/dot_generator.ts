import chalk from 'chalk';
import { type Model } from '../language-server/generated/ast';

export function generateDot(model: Model, filePath: string, destination: string | undefined): string {
	console.log(chalk.grey('Generating dot file...'));
	return '';
}
