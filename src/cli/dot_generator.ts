import chalk from "chalk";
import { Model } from "../language-server/generated/ast";

export function generateDot(model: Model, filePath: string, destination: string | undefined): void {
  console.log(chalk.grey("Generating dot file..."))
}
