grammar StrucTs

// Define a Model element to capture the top-level program structure
entry Model:
    elements+=Element*;


/* SECTION: Basic elements */
// Define an element to represent the different constructs in the DSL
Element:
    Class/*| Association*/;

// Define the 'Class' rule to capture class definitions
Class:
    'class' name=ID ('implements' implemented+=Interface)? '{'
    properties+=Property* '}';

// Define a 'ClassReference' rule to reference other classes in the DSL
ClassReference:
    class=[Class];


/* SECTION: Class Interfaces  */
// Define a generic 'Interface' rule to capture interfaces, like 'FactoryInterface'
Interface:
    // It would be possible to add other interfaces here '|'
    FactoryInterface;

// Define the 'FactoryInterface' rule for capturing factory implementations
FactoryInterface:
    // REVIEW: This might be a hack to have 'Factory' as a keyword
    STRING='Factory';


/* SECTION: Class Properties */
// Define the 'Property' rule to capture the properties of a class. It can be a statement for composition, attribute, or reference.
Property:
    ReferencingProperty | AttributeProperty;

ReferencingProperty:
    ComposedProperty | ReferenceProperty;

ComposedProperty:
    'composed_of' name=ID ':' type=ClassReference cardinality=Cardinality? ';';

AttributeProperty:
    // REVIEW: do we really want to allow cardinality for primitive types?
    'attribute' name=ID ':' type=DataType cardinality=Cardinality? ';';

ReferenceProperty:
    // REVIEW: This is, effectively, an association
    'references' name=ID ':' type=ClassReference cardinality=Cardinality? ';';


/* SECTION: Data Types */
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


/* SECTION: Terminal rules */
// Define terminal rules
hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

// Define comment rules
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
