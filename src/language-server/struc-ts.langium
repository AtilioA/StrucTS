grammar StrucTs

// Define a Model element to capture the top-level program structure
entry Model:
    elements+=Element*;

/* SECTION: Basic elements */
// Define an element to represent the different constructs in the DSL
Element:
    Class;

// Define the 'Class' rule to capture class definitions
Class:
    'class' name=ID (implements=Implements)? '{'
    statements+=ClassElement* '}';

Implements:
    'implements' (
        // Allow optional parenthesis around the implemented interfaces
        '(' implemented+=Interface (',' implemented+=Interface)* ')' |
        implemented+=Interface (',' implemented+=Interface)*
    );

ClassElement:
    Property | Method;

/* SECTION: Class Methods */
Method:
    'method' name=ID '(' (parameters+=Parameter (',' parameters+=Parameter)*)? ')' ';';

Parameter:
    name=ID (':' type=Type)?;

/* SECTION: Class Interfaces  */
Interface:
    FactoryInterface | BuilderInterface;

// Define the 'FactoryInterface' rule for capturing factory implementations
FactoryInterface:
    name='Factory';

BuilderInterface:
    name='Builder';

/* SECTION: Class Properties */
Property:
    ReferencingProperty | AttributeProperty;

ReferencingProperty:
    ComposedProperty | ReferenceProperty;

// Define a 'ClassReference' rule to reference other classes in the DSL
ClassReference:
    class=[Class];

ComposedProperty:
    'composed_of' name=ID ':' type=ClassReference cardinality=Cardinality? ';';

AttributeProperty:
    'attribute' name=ID ':' type=DataType cardinality=Cardinality? ';';

ReferenceProperty:
    'references' name=ID ':' type=ClassReference cardinality=Cardinality? ';';


/* SECTION: Data Types */
// Define the 'Type' rule to represent types in the DSL. It can be a primitive type or a reference to another class object
Type:
    DataType | ClassReference;

// Define the 'DataType' rule for primitive data types. Currently, only string, number and boolean are supported.
DataType returns string:
    'string' | 'number' | 'boolean' | 'any';

// Define the 'Cardinality' rule to represent cardinalities in the DSL
Cardinality:
    '[' lower=CARDINALITY_LIMIT ('..' upper=CARDINALITY_LIMIT)? ']';

CARDINALITY_LIMIT returns string:
    '*' | INT;

/* SECTION: Terminal rules */
// Define terminal rules
hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
// terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

// Define comment rules
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
