import { type Model, type Class, type Property, isClass, isProperty } from '../../language-server/generated/ast';

export function hasClassImplementedFactory(classDef: Class): boolean {
	return classDef.implemented.some(i => i.name === 'Factory');
}

// Check if a property has cardinality constraints
export function checkCardinalityConstraints(property: Property): boolean {
	return property.cardinality !== null;
}

// Check if any property in the model has cardinality. Naive way to check if importing CustomCollection is necessary.
export function hasCardinality(model: Model): boolean {
	for (const element of model.elements) {
		if (isClass(element)) {
			for (const prop of element.statements) {
				if (isProperty(prop) && checkCardinalityConstraints(prop)) {
					return true;
				}
			}
		}
	}

	return false;
}
