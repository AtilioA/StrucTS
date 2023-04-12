grammar StrucTs

// Define a Model element to capture the top-level program structure
entry Model:
    elements+=Element*;

// Define an element to represent the different constructs in the DSL
Element:
    Class | Association;

// Define the 'Class' rule to capture class definitions
Class:
    'class' name=ID ('implements' implemented+=FactoryInterface)? '{'
    properties+=Property* '}';

// Define the 'FactoryInterface' rule
FactoryInterface:
    // REVIEW: This might be a hack to have 'Factory' as a keyword
    STRING='Factory';

// Define the 'Property' rule to capture the properties of a class
Property:
    ('composed_of' | 'contains' | 'in')? name=ID ':' type=Type cardinality=Cardinality? ';';

// Define the 'Type' rule to represent types in the DSL
Type:
    DataType | Class;

// Define the 'DataType' rule for primitive data types
DataType returns string:
    'string' | 'number' | 'boolean';

// Define the 'Cardinality' rule to represent cardinalities in the DSL
Cardinality:
    '[' lower=INT ('..' upper=INT)? ']';

// Define the 'Association' rule to capture associations between classes
Association:
    'association' name=ID '{' 'between:' left=ClassReference cardinalityLeft=Cardinality
    'and' right=ClassReference cardinalityRight=Cardinality ';' '}';

// Define a 'ClassReference' rule to reference other classes in the DSL
ClassReference:
    class=[Class];

// Define terminal rules
hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
