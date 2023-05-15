import { type ValidationChecks } from 'langium';
import { type StrucTsAstType } from './generated/ast';
import type { StrucTsServices } from './struc-ts-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: StrucTsServices) {
	const registry = services.validation.ValidationRegistry;
	const classValidator = services.validation.StrucTSClassValidator;
	const modelValidator = services.validation.StrucTSModelValidator;

	// TODO: Whenever appropriate, use Class instead of Model, and remove isClass checks inside the validation functions
	const modelChecks: ValidationChecks<StrucTsAstType> = {
		Model: [
			modelValidator.checkUniqueClassNames,
			modelValidator.checkTypeScriptReservedKeywords,
		],
	};

	const classChecks: ValidationChecks<StrucTsAstType> = {
		Class: [
			classValidator.checkUniqueMethodNames,
			classValidator.checkMethodNameNotClassName,
			classValidator.checkMethodNameNotPropertyName,
			classValidator.checkUniqueParameterNames,
		] };

	registry.register(classChecks, modelValidator);
	registry.register(modelChecks, classValidator);
}
