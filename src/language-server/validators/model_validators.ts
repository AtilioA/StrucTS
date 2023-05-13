import { ValidationAcceptor } from "langium";
import { Model, isClass, isMethod, isProperty } from "../generated/ast";
import { reservedKeywords } from "./utils";

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

  // Validation function for checking TypeScript reserved keywords
  checkTypeScriptReservedKeywords(model: Model, accept: ValidationAcceptor): void {
    model.elements.forEach(e => {
      if (isClass(e)) {
        const className = e.name;
        if (reservedKeywords.has(className)) {
          accept('error', `Class name '${className}' is a reserved keyword in TypeScript.`, {node: e, property: 'name'});
        }
      }

      model.elements.forEach(e => {
        if (isClass(e)) {
          const className = e.name;

          if (reservedKeywords.has(className)) {
            accept('error', `Class name '${className}' is a reserved keyword in TypeScript.`, {node: e, property: 'name'});
          }

          e.statements.forEach(s => {
            if (isProperty(s)) {
              const propertyName = s.name;
              if (reservedKeywords.has(propertyName)) {
                accept('error', `Property name '${propertyName}' in class '${className}' is a reserved keyword in TypeScript.`, {node: s, property: 'name'});
              }
            } else if (isMethod(s)) {
              const methodName = s.name;

              if (reservedKeywords.has(methodName)) {
                accept('error', `Method name '${methodName}' in class '${className}' is a reserved keyword in TypeScript.`, {node: s, property: 'name'});
              }

              s.parameters.forEach(p => {
                const paramName = p.name;

                if (reservedKeywords.has(paramName)) {
                  accept('error', `Parameter name '${paramName}' in method '${methodName}' of class '${className}' is a reserved keyword in TypeScript.`, {node: p, property: 'name'});
                }
              });
            }
          });
        }
      });
    });
  }
}
