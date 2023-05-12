import { ValidationAcceptor } from "langium";
import { Model, isClass } from "../generated/ast";

/**
 * Implementation of validations for the whole model.
 */
export class StrucTSModelValidator {
  // Validation function for unique classes names
  checkUniqueClassNames(model: Model, accept: ValidationAcceptor): void {
      // Store reported class names; if a class name is already reported, it is not unique
      const reportedClassNames = new Set();
      model.elements.forEach(e => {
          if (isClass(e)) {
              const className = e.name;
              if (reportedClassNames.has(className)) {
                  accept('error', `Class has non-unique name '${className}'.`, {node: e, property: 'name'});
              }
              reportedClassNames.add(className);
          }
      });
  }
}
