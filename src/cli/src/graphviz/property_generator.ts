import { type Cardinality, type Property, isReferenceProperty, isComposedProperty } from '../../../language-server/generated/ast';

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

export function generateGraphvizProperty(property: Property): string {
	if (isReferenceProperty(property) || isComposedProperty(property)) {
		return `${property.name}: ${property.type.class.ref?.name} ${generateCardinalityString(property.cardinality)}`;
	} else {
		return `${property.name}: ${property.type}`;
	}
}
