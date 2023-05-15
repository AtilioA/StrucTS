import {type ValidationAcceptor} from 'langium';
import {type Model, isClass, isMethod, isProperty} from '../generated/ast';
import {reservedKeywords} from './utils';

/**
 * Implementation of validations for the whole model.
 */
export class StrucTSModelValidator {
	// Validation function for unique classes names
	checkUniqueClassNames(model: Model, accept: ValidationAcceptor): void {
		// Store reported class names; if a class name is already reported, it is not unique
		const reportedClassNames = new Set();
		for (const e of model.elements) {
			if (isClass(e)) {
				const className = e.name;
				if (reportedClassNames.has(className)) {
					accept('error', `Class has non-unique name '${className}'.`, {node: e, property: 'name'});
				}

				reportedClassNames.add(className);
			}
		}
	}

	// Validation function for checking TypeScript reserved keywords
	checkTypeScriptReservedKeywords(model: Model, accept: ValidationAcceptor): void {
		for (const e of model.elements) {
			if (isClass(e)) {
				const className = e.name;
				if (reservedKeywords.has(className)) {
					accept('error', `Class name '${className}' is a reserved keyword in TypeScript.`, {node: e, property: 'name'});
				}
			}

			for (const e of model.elements) {
				if (isClass(e)) {
					const className = e.name;

					if (reservedKeywords.has(className)) {
						accept('error', `Class name '${className}' is a reserved keyword in TypeScript.`, {node: e, property: 'name'});
					}

					for (const s of e.statements) {
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

							for (const p of s.parameters) {
								const parameterName = p.name;

								if (reservedKeywords.has(parameterName)) {
									accept('error', `Parameter name '${parameterName}' in method '${methodName}' of class '${className}' is a reserved keyword in TypeScript.`, {node: p, property: 'name'});
								}
							}
						}
					}
				}
			}
		}
	}
}
