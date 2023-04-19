grammar StrucTs

// Define a Model element to capture the top-level program structure
entry Model:
    elements+=Element*;

// Define an element to represent the different constructs in the DSL
Element:
    Class/* | Association*/;

// Define the 'Class' rule to capture class definitions
Class:
    'class' name=ID ('implements' implemented+=Interface)? '{'
    properties+=Property* '}';

// Define a generic 'Interface' rule to capture interfaces, like 'FactoryInterface'
Interface:
    // It would be possible to add other interfaces here '|'
    FactoryInterface;

// Define the 'FactoryInterface' rule for capturing factory implementations
FactoryInterface:
    // REVIEW: This might be a hack to have 'Factory' as a keyword
    STRING='Factory';

// Define the 'Property' rule to capture the properties of a class
Property:
    // This allows cardinalities with a primitive type.
    ('composed_of' | 'attribute')? name=ID ':' type=Type cardinality=Cardinality? ';';
// TODO: add 'reference' keyword to allow references to other classes


// Define the 'Type' rule to represent types in the DSL. It can be a primitive type or a reference to another class object
Type:
    DataType | ClassReference;

// Define the 'DataType' rule for primitive data types. Currently, only string, number and boolean are supported.
DataType returns string:
    'string' | 'number' | 'boolean';

// Define the 'Cardinality' rule to represent cardinalities in the DSL
Cardinality:
    '[' lower=INT ('..' upper=INT)? ']';

// REVIEW: Check if this is needed
// // Define the 'Association' rule to capture associations between classes
// Association:
//     'association' name=ID '{' 'between:' left=ClassReference cardinalityLeft=Cardinality
//     'and' right=ClassReference cardinalityRight=Cardinality ';' '}';

// Define a 'ClassReference' rule to reference other classes in the DSL
ClassReference:
    class=[Class];

// Define terminal rules
hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

// Define comment rules
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
