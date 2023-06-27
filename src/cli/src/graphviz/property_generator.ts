import { type Cardinality, type AttributeProperty } from '../../../language-server/generated/ast';

export function generateCardinalityString(cardinality: Cardinality | undefined) {
	if (cardinality) {
		if (cardinality.upper === undefined) {
			return `[${cardinality.lower}]`;
		} else {
			return `[${cardinality.lower}..${cardinality.upper}]`;
		}
	}

	return '';
}

export function generateGraphvizProperty(property: AttributeProperty): string {
	return `${property.name}: ${property.type}`;
}
