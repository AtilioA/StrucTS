import { CompositeGeneratorNode, NL } from 'langium';
import { type Class, isProperty } from '../../../language-server/generated/ast';
import { generateGraphvizProperty } from './property_generator';

export function generateGraphvizClass(cls: Class): CompositeGeneratorNode {
	const classGeneratorNode = new CompositeGeneratorNode();

	classGeneratorNode.append(cls.name, ' [label=<<B>', cls.name, '</B>|');

	for (const statement of cls.statements) {
		if (isProperty(statement)) {
			const propertyString = generateGraphvizProperty(statement);
			// If last, end with an extra chevron (">")
			classGeneratorNode.append('<FONT POINT-SIZE="10"><I>', propertyString, '</I><BR/></FONT>');
			if (statement === cls.statements[cls.statements.length - 1]) {
				classGeneratorNode.append('>', NL);
			} else {
				classGeneratorNode.append(NL);
			}
		}
	}

	classGeneratorNode.append(']', NL);

	return classGeneratorNode;
}
