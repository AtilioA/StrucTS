import { type Model, type Class, type Property, isClass, isProperty, isComposedProperty } from '../../language-server/generated/ast';

export type IGeneratedPatterns = {
	factory: boolean;
	builder: boolean;
};

export function getGeneratedPatterns(classDef: Class): IGeneratedPatterns {
	const generatedPatterns: IGeneratedPatterns = {
		factory: false,
		builder: false,
	};

	if (classDef.generate) {
		for (const generated of classDef.generate.generated) {
			generatedPatterns[generated.name] = true;
		}
	}

	return generatedPatterns;
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

export function isComposedInOtherClasses(cls: Class, model: Model): boolean {
	for (const element of model.elements) {
		if (isClass(element)) {
			for (const statement of element.statements) {
				if (isComposedProperty(statement) && statement.type.class.ref?.name === cls.name) {
					return true;
				}
			}
		}
	}

	return false;
}
