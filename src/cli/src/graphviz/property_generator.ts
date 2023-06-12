import { type Cardinality, type Property } from '../../../language-server/generated/ast';

function generateCardinalityString(cardinality: Cardinality | undefined) {
	if (cardinality) {
		if (cardinality.upper === undefined) {
			return `[${cardinality.lower}]`;
		} else {
			return `[${cardinality.lower}..${cardinality.upper}]`;
		}
	}

	return '';
}

export function generateGraphvizProperty(property: Property): string {
	return `${property.name}: (type)${generateCardinalityString(property.cardinality)}`;
}
