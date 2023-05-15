import { type ValidationAcceptor } from 'langium';
import { isProperty, type Class, isMethod, isReferenceProperty } from '../generated/ast';
import { areCardinalitiesValid } from './utils';

/**
 * Implementation of validations for the Class node.
 */
export class StrucTSClassValidator {
	// Check if attribute names are unique within a class
	checkUniqueAttributeNames(classNode: Class, accept: ValidationAcceptor): void {
		// Only store attribute names for the current class; otherwise, attributes of different classes would be considered non-unique
		const reportedAttributeNames = new Set();
		for (const statement of classNode.statements) {
			if (isProperty(statement)) {
				const attributeName = statement.name;
				if (reportedAttributeNames.has(attributeName)) {
					accept('error', `Attribute has non-unique name '${attributeName}'.`, { node: statement, property: 'name' });
				}

				reportedAttributeNames.add(attributeName);
			}
		}
	}

	// Check if cardinalities bounds are valid (e.g., [0..*] is valid, [2..0] is not), using the areCardinalitiesValid function
	checkValidCardinality(classNode: Class, accept: ValidationAcceptor): void {
		for (const statement of classNode.statements) {
			if (isProperty(statement)) {
				const lowerLimit = statement.cardinality?.lower;
				const upperLimit = statement.cardinality?.upper;
				if (lowerLimit && upperLimit) {
					const validationResult = areCardinalitiesValid(lowerLimit.toString(), upperLimit.toString());
					if (!validationResult.valid) {
						accept('error', `Invalid cardinality '${lowerLimit}..${upperLimit}': ${validationResult.message}`, { node: statement, property: 'cardinality' });
					}
				}
			}
		}
	}

	// Check if the referenced class is the same as the current class
	checkDirectSelfReferences(classNode: Class, accept: ValidationAcceptor): void {
		for (const statement of classNode.statements) {
			if (isProperty(statement) && isReferenceProperty(statement)) {
				const referencedClass = statement.type?.class?.ref;
				if (referencedClass && referencedClass === classNode) {
					accept('error', `Class '${classNode.name}' has a direct self-reference.`, { node: statement, property: 'name' });
				}
			}
		}
	}

	// Check if the method names are unique within a class
	checkUniqueMethodNames(classNode: Class, accept: ValidationAcceptor): void {
		const methodNames = new Set<string>();
		for (const statement of classNode.statements) {
			if (isMethod(statement)) {
				const name = statement.name;
				if (methodNames.has(name)) {
					accept('error', `Duplicate method name '${name}'.`, { node: statement, property: 'name' });
				} else {
					methodNames.add(name);
				}
			}
		}
	}

	// Check if the method name is the same as the class name
	checkMethodNameNotClassName(classNode: Class, accept: ValidationAcceptor): void {
		const className = classNode.name;
		for (const statement of classNode.statements) {
			if (isMethod(statement) && statement.name === className) {
				accept('error', `Method name '${className}' should not be the same as the Class name.`, { node: statement, property: 'name' });
			}
		}
	}

	// Check if the method name is the same as a property name
	checkMethodNameNotPropertyName(classNode: Class, accept: ValidationAcceptor): void {
		const propertyNames = new Set<string>();
		for (const statement of classNode.statements) {
			if (isProperty(statement)) {
				propertyNames.add(statement.name);
			} else if (isMethod(statement)) {
				const name = statement.name;
				if (propertyNames.has(name)) {
					accept('error', `Method '${name}' should not have the same name as another property in the same class.`, { node: statement, property: 'name' });
				}
			}
		}
	}

	// Check if the parameter names are unique within a method
	checkUniqueParameterNames(classNode: Class, accept: ValidationAcceptor): void {
		for (const statement of classNode.statements) {
			if (isMethod(statement)) {
				const method = statement;
				const parameterNames = new Set();
				for (const parameter of method.parameters) {
					if (parameterNames.has(parameter.name)) {
						accept('error', `Duplicate parameter name '${parameter.name}' in method '${method.name}'.`, { node: parameter, property: 'name' });
					} else {
						parameterNames.add(parameter.name);
					}
				}
			}
		}
	}
}
