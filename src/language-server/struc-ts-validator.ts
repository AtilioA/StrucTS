import { ValidationAcceptor, ValidationChecks } from 'langium';
import { StrucTsAstType, Person } from './generated/ast';
import type { StrucTsServices } from './struc-ts-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: StrucTsServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.StrucTsValidator;
    const checks: ValidationChecks<StrucTsAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class StrucTsValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
