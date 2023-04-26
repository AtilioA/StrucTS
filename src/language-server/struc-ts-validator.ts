import { ValidationAcceptor, ValidationChecks } from 'langium';
import { StrucTsAstType, Model, isClass } from './generated/ast';
import type { StrucTsServices } from './struc-ts-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: StrucTsServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.StrucTSValidator;
    const checks: ValidationChecks<StrucTsAstType> = {
        Model: [validator.checkUniqueClassNames, validator.checkUniqueAttributeNames]
    };
    registry.register(checks, validator);
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

    checkUniqueAttributeNames(model: Model, accept: ValidationAcceptor): void {
        model.elements.forEach(e => {
            if (isClass(e)) {
                // Only store attribute names for the current class; otherwise, attributes of different classes would be considered non-unique
                const reportedAttributeNames = new Set();
                e.properties.forEach(a => {
                    const attributeName = a.name;
                    if (reportedAttributeNames.has(attributeName)) {
                        accept('error', `Attribute has non-unique name '${attributeName}'.`, {node: a, property: 'name'});
                    }
                    reportedAttributeNames.add(attributeName);
                });
            }
        });
    }
}
