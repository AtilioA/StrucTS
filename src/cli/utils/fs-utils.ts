import fs from "fs";
import path from "path";

import { Model } from "../../language-server/generated/ast";
import { CompositeGeneratorNode, NL } from "langium";
import { hasCardinality } from "./model_checks";

export function appendImports(fileNode: CompositeGeneratorNode, model: Model, outputPath: string | undefined): void {
  const neededImports = {
      customCollection: hasCardinality(model),
  }

  // If any needed imports are detected, create the strucTS_core directory under the output directory
    // If any needed imports are detected, create the strucTS_core directory under the output directory
    const corePath = path.join(outputPath || "generated", 'strucTS_core');
    if (!fs.existsSync(corePath)) {
      fs.mkdirSync(corePath);
    }

  if (neededImports.customCollection) {
      fileNode.append("import { CustomCollection } from './strucTS_core/custom_collection';");
      fileNode.appendNewLine();
      fileNode.appendNewLine();
      
      const sourcePath = path.join(__dirname, '../../../src/core/custom_collection.ts');
      const destinationPath = path.join(corePath, 'custom_collection.ts');

      fs.copyFileSync(sourcePath, destinationPath);
  }
}
