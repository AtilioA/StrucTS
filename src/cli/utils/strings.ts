import { type Property, isAttributeProperty, type Cardinality, isComposedProperty, isReferenceProperty } from '../../language-server/generated/ast';

type ICardinalityLimit = {
 upper: string | undefined;
 lower: string | undefined;
};

export function convertCardinalityLimitToValue(limit: Cardinality | undefined): ICardinalityLimit {
	const limits: ICardinalityLimit = {
		upper: limit?.upper?.toString(),
		lower: limit?.lower?.toString(),
	};

	if (limit?.upper === undefined) {
		limits.upper = Number.isNaN(limit?.lower) ? 'null' : limit?.lower.toString();
	} else if (limit?.upper === '*') {
		limits.upper = 'null';
	}

	if (limit?.lower === '*') {
		limits.lower = '0';
	}

	return limits;
}

export function createCollectionString(property: Property) {
	const cardinalityLimits = convertCardinalityLimitToValue(property?.cardinality);

	if (isAttributeProperty(property)) {
		return `new CustomCollection<${property.type}>(${cardinalityLimits.lower}, ${cardinalityLimits.upper});`;
	} else if (isReferenceProperty(property) || isComposedProperty(property)) {
		// Composition or reference
		return `new CustomCollection<${property.type.class.ref?.name}>(${cardinalityLimits.lower}, ${cardinalityLimits.upper});`;
	}

	return '';
}

// Adapted from https://stackoverflow.com/a/73876341; license might vary
export function convertToPascalCase(s: string): string {
	// If the string is only lowercase letters and numbers
	if (/^[a-z\d]+$/i.test(s)) {
		// Uppercase the first letter
		return s.charAt(0).toUpperCase() + s.slice(1);
	} else {
		// Uppercase the first letter of each word separated by a non-alphanumeric character
		return s.replace(
			/([a-z\d])([a-z\d]*)/gi,
			(g0: string, g1: string, g2: string) => g1.toUpperCase() + g2.toLowerCase(),
		// Remove all non-alphanumeric characters
		).replace(/[^a-z\d]/gi, '');
	}
}

export function makeFirstLetterUpperCase(s: string | undefined): string | undefined {
	if (!s) {
		return undefined;
	}

	return s.charAt(0).toUpperCase() + s.slice(1);
}
