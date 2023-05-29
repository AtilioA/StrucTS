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

export function convertToPascalCase(name: string): string {
	return name.replace(/(\w)(\w*)/g, (_, first: string, rest: string) => first.toUpperCase() + rest.toLowerCase());
}
