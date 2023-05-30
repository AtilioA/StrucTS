import { type CARDINALITY_LIMIT, type Property, isAttributeProperty } from '../../language-server/generated/ast';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export function convertCardinalityLimitToValue(limit: CARDINALITY_LIMIT | undefined): string | CARDINALITY_LIMIT | undefined {
	if (limit === '*') {
		return 'null';
	}

	return limit;
}

export function createCollectionString(property: Property) {
	const lowerLimit = convertCardinalityLimitToValue(property?.cardinality?.lower);
	const upperLimit = convertCardinalityLimitToValue(property?.cardinality?.upper);

	if (isAttributeProperty(property)) {
		return `new CustomCollection<${property.type}>(${lowerLimit}, ${upperLimit});`;
	} else {
		// Composition or reference
		return `new CustomCollection<${property.type.class.ref?.name}>(${lowerLimit}, ${upperLimit});`;
	}
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
