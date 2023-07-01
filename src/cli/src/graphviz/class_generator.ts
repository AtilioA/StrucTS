import { CompositeGeneratorNode, IndentNode, NL } from 'langium';
import { type Class, isProperty, isReferenceProperty, isComposedProperty, type Model, isClass, isAttributeProperty } from '../../../language-server/generated/ast';
import { generateCardinalityString, generateGraphvizProperty } from './property_generator';

export function generateAssociations(model: Model): IndentNode {
	const associationsNode = new IndentNode();

	// Add comment for clarity
	associationsNode.append(NL, '// Class associations', NL);

	for (const cls of model.elements) {
		if (isClass(cls)) {
			// REVIEW: this might generate duplicate associations
			for (const property of cls.statements) {
				if (isProperty(property)) {
					// Check if the property is a reference or composition so we can generate the correct label
					if (isReferenceProperty(property)) {
						associationsNode.append(`${cls.name} -> ${property.type.class.ref?.name} [label="${property.name} ${generateCardinalityString(property.cardinality)}", arrowhead="vee"]`, NL);
					} else if (isComposedProperty(property)) {
						associationsNode.append(`${cls.name} -> ${property.type.class.ref?.name} [label="${property.name} ${generateCardinalityString(property.cardinality)}", arrowtail="diamond", arrowhead="none", dir="both"]`, NL);
					}
				}
			}
		}
	}

	return associationsNode;
}

export function generateGraphvizClass(cls: Class): CompositeGeneratorNode {
	const classGeneratorNode = new CompositeGeneratorNode();

	classGeneratorNode.append(cls.name, ' [label=<<B>', cls.name, '</B>|');

	for (const statement of cls.statements) {
		if (isProperty(statement) && isAttributeProperty(statement)) {
			const propertyString = generateGraphvizProperty(statement);
			classGeneratorNode.append('<FONT POINT-SIZE="10"><I>', propertyString, '</I><BR/></FONT>');
		}
	}

	classGeneratorNode.append('>', NL);
	classGeneratorNode.append(']', NL);

	return classGeneratorNode;
}
