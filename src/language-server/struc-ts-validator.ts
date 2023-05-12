import { ValidationAcceptor, ValidationChecks } from 'langium';
import { StrucTsAstType, Model, isClass, isReferencingProperty, Class, isProperty, isMethod} from './generated/ast';
import type { StrucTsServices } from './struc-ts-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: StrucTsServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.StrucTSValidator;

    // TODO: Whenever appropriate, use Class instead of Model, and remove isClass checks inside the validation functions
    const modelChecks: ValidationChecks<StrucTsAstType> = {
        Model: [
            validator.checkUniqueClassNames,
            validator.checkUniqueAttributeNames,
            validator.checkValidCardinality,
            validator.checkDirectSelfReferences,
        ]
    };

    const classChecks: ValidationChecks<StrucTsAstType> = {
        Class: [
            validator.checkUniqueMethodNames,
            validator.checkMethodNameNotClassName,
            validator.checkMethodNameNotPropertyName,
            validator.checkUniqueParameterNames
    ]};

    registry.register(modelChecks, validator);
    registry.register(classChecks, validator);
}

/**
 *
 * @param lowerLimit Lower limit of the cardinality
 * @param upperLimit Upper limit of the cardinality
 * @returns an object with 'valid' and 'message' properties. The valid property indicates if the cardinality is valid or not, and the message property provides the reason for the invalid cardinality.
 */
function areCardinalitiesValid(lowerLimit: string, upperLimit: string): {valid: boolean, message: string} {
    // If lower limit is *, we cannot/should not have an upper limit. e.g. [*] is valid, [*..2] and [*..*] are not.
    if (lowerLimit === "*" && upperLimit) {
        return { valid: false, message: "Lower limit '*' should not have an upper limit." };
        // If both limits are numbers, check if lower limit is greater or equal to upper limit.
    } else if (!isNaN(Number(lowerLimit)) && !isNaN(Number(upperLimit)) && Number(lowerLimit) >= Number(upperLimit)) {
        // If so, the cardinality is invalid. e.g. [2..1] and [2..2] are invalid.
        return { valid: false, message: "Lower limit should be strictly less than upper limit." };
    // All other cases should be valid.
    } else {
        return { valid: true, message: "" };
    }
}

/**
 * Implementation of custom validations.
 */
export class StrucTSValidator {
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

    // Check if attribute names are unique within a class
    checkUniqueAttributeNames(model: Model, accept: ValidationAcceptor): void {
        model.elements.forEach(e => {
            if (isClass(e)) {
                // Only store attribute names for the current class; otherwise, attributes of different classes would be considered non-unique
                const reportedAttributeNames = new Set();
                e.statements.forEach(statement => {
                    if (isProperty(statement)) {
                    const attributeName = statement.name;
                    if (reportedAttributeNames.has(attributeName)) {
                        accept('error', `Attribute has non-unique name '${attributeName}'.`, {node: statement, property: 'name'});
                    }
                    reportedAttributeNames.add(attributeName);
                }
                });
            }
        });
    }


    // Check if cardinalities bounds are valid (e.g., [0..*] is valid, [2..0] is not),using the areCardinalitiesValid function
    checkValidCardinality(model: Model, accept: ValidationAcceptor): void {
        model.elements.forEach(e => {
            if (isClass(e)) {
                e.statements.forEach(statement => {
                    if (isProperty(statement)) {
                    const lowerLimit = statement.cardinality?.lower;
                    const upperLimit = statement.cardinality?.upper;
                    if (lowerLimit && upperLimit) {
                        const validationResult = areCardinalitiesValid(lowerLimit.toString(), upperLimit.toString());
                        if (!validationResult.valid) {
                            accept('error', `Invalid cardinality '${lowerLimit}..${upperLimit}': ${validationResult.message}`, {node: statement, property: 'cardinality'});
                        }
                    }}
                });
            }
        })
    }

    checkDirectSelfReferences(model: Model, accept: ValidationAcceptor): void {
        model.elements.forEach(e => {
            if (isClass(e)) {
                e.statements.forEach(statement => {
                    if (isProperty(statement)) {
                    if (isReferencingProperty(statement)) {
                        const referencedClass = statement.type?.class?.ref;
                        if (referencedClass && referencedClass === e) {
                            accept('error', `Class '${e.name}' has a direct self-reference.`, {node: statement, property: "name"});
                        }
                    }}
                });
            }
        });
    }

    checkUniqueMethodNames(classNode: Class, accept: ValidationAcceptor): void {
        const methodNames = new Set<string>();
        for (const statement of classNode.statements) {
            if (isMethod(statement)) {
                const name = statement.name;
                if (methodNames.has(name)) {
                    accept('error', `Duplicate method name '${name}'.`, {node: statement, property: 'name'});
                } else {
                    methodNames.add(name);
                }
            }
        }
    }

    checkMethodNameNotClassName(classNode: Class, accept: ValidationAcceptor): void {
        const className = classNode.name;
        for (const statement of classNode.statements) {
            if (isMethod(statement) && statement.name === className) {
                accept('error', `Method name '${className}' should not be the same as the Class name.`, {node: statement, property: 'name'});
            }
        }
    }

    checkMethodNameNotPropertyName(classNode: Class, accept: ValidationAcceptor): void {
        const propertyNames = new Set<string>();
        for (const statement of classNode.statements) {
            if (isProperty(statement)) {
                propertyNames.add(statement.name);
            } else if (isMethod(statement)) {
                const name = statement.name;
                if (propertyNames.has(name)) {
                    accept('error', `Method '${name}' should not have the same name as another property in the same class.`, {node: statement, property: 'name'});
                }
            }
        }
    }

    checkUniqueParameterNames(classNode: Class, accept: ValidationAcceptor): void {
        classNode.statements.forEach(statement => {
            if (isMethod(statement)) {
                const method = statement;
                const parameterNames = new Set();
                method.parameters.forEach(parameter => {
                    if (parameterNames.has(parameter.name)) {
                        accept('error', `Duplicate parameter name '${parameter.name}' in method '${method.name}'.`, {node: parameter, property: 'name'});
                    } else {
                        parameterNames.add(parameter.name);
                    }
                });
            }
        });
    }
}
