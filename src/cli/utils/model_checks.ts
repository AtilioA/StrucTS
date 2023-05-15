import { Model, Class, Property, isClass, isProperty } from "../../language-server/generated/ast";

export function hasClassImplementedFactory(classDef: Class): boolean {
  return classDef.implemented.some(i => i.name === 'Factory');
}

// Check if a property has cardinality constraints
export function checkCardinalityConstraints(property: Property): boolean {
  return property.cardinality !== null;
}

// Check if any property in the model has cardinality. Naive way to check if importing CustomCollection is necessary.
export function hasCardinality(model: Model): boolean {
  for (const e of model.elements) {
      if (isClass(e)) {
          for (const prop of e.statements) {
            if (isProperty(prop)) {
              if (checkCardinalityConstraints(prop)) {
                  return true;
              }
            }
          }
      }
  }
  return false;
}
