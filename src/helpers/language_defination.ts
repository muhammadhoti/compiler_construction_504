import { LanguageDefinedConstant } from "../models/models";
import { LanguageDefinedConstantTypes, Regex } from "./enums";

export class LanguageDefination {
    keywords : LanguageDefinedConstant[] = [
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "int",
            valuePart : "int"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "double",
            valuePart : "double"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "String",
            valuePart : "String"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "char",
            valuePart : "char"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "boolean",
            valuePart : "boolean"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "if",
            valuePart : "if"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "else",
            valuePart : "else"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "switch",
            valuePart : "switch"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "case",
            valuePart : "case"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "default",
            valuePart : "default"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "break",
            valuePart : "break"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "continue",
            valuePart : "continue"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "try",
            valuePart : "try"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "catch",
            valuePart : "catch"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "finally",
            valuePart : "finally"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "while",
            valuePart : "while"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "doWhile",
            valuePart : "do while"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "public",
            valuePart : "public"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "private",
            valuePart : "private"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "protected",
            valuePart : "protected"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "static",
            valuePart : "static"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "class",
            valuePart : "class"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "extends",
            valuePart : "extends"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "return",
            valuePart : "return"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "void",
            valuePart : "void"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "new",
            valuePart : "new"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "main",
            valuePart : "main"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "this",
            valuePart : "this"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "abstract",
            valuePart : "abstract"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "final",
            valuePart : "final"

        },
        {
            type : LanguageDefinedConstantTypes.keyword,
            classPart : "break",
            valuePart : "break"

        }
    ];
    operators : LanguageDefinedConstant[] = [
        //Arithmetic Operators
            //+,- Belongs To Same Class
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "+",
            valuePart : "+"
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "-",
            valuePart : "-"
        },
            //+,- Belongs To Same Sub Class
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "*",
            valuePart : "*"
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "/",
            valuePart : "/"
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "%",
            valuePart : "%"
        },
        //Arithmetic Operators
        //Logical Operators
            //for finding operator char only
            {
                type : LanguageDefinedConstantTypes.operator,
                classPart : "&",
                valuePart : "&"
            },
            {
                type : LanguageDefinedConstantTypes.operator,
                classPart : "|",
                valuePart : "|"
            },
            //for finding operator only
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "&&",
            valuePart : "&&"
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "||",
            valuePart : "||"
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "!",
            valuePart : "!"
        },
        //Logical Operators
        //Relational Operators
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "<",
            valuePart : "<"
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : ">",
            valuePart : ">"
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "<=",
            valuePart : "<="
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : ">=",
            valuePart : ">="
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "==",
            valuePart : "=="
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "!=",
            valuePart : "!="
        },
        //Relational Operators
        //Increament/Decreament Operator
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "++",
            valuePart : "++"
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "--",
            valuePart : "--"
        },
        //Increament/Decreament Operator
        //Associative Operator
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "=",
            valuePart : "="
        },
            //Belongs To Same Sub Class i.e right associative
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "+=",
            valuePart : "+="
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "-=",
            valuePart : "-="
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "*=",
            valuePart : "*="
        },
        {
            type : LanguageDefinedConstantTypes.operator,
            classPart : "/=",
            valuePart : "/="
        }
            //Belongs To Same Sub Class i.e right associative
        //Associative Operator
    ];
    punctuators : LanguageDefinedConstant[] = [
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : ",",
            classPart : ","
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : ";",
            classPart : ";"
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : ":",
            classPart : ":"
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : "(",
            classPart : "("
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : ")",
            classPart : ")"
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : "{",
            classPart : "{"
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : "}",
            classPart : "}"
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : "[",
            classPart : "["
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : "]",
            classPart : "]"
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : ".",
            classPart : "."
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : "?",
            classPart : "?"
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : '"',
            classPart : '"'
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : "'",
            classPart : "'"
        },
        {
            type : LanguageDefinedConstantTypes.punctuator,
            valuePart : "\\",
            classPart : "\\"
        }
    ];
    comments : LanguageDefinedConstant[] = [
        {
            type : LanguageDefinedConstantTypes.comment,
            classPart:"//",
            valuePart: "//"
        },
        {
            type : LanguageDefinedConstantTypes.comment,
            classPart:"/*",
            valuePart: "/*"
        },
        {
            type : LanguageDefinedConstantTypes.comment,
            classPart:"*/",
            valuePart: "*/"
        }
    ];
    identifier : LanguageDefinedConstant = {
        type : LanguageDefinedConstantTypes.identifier,
        classPart : "",
        valuePart : ""
    };
    constant : LanguageDefinedConstant = {
        type : LanguageDefinedConstantTypes.constant,
        classPart : "",
        valuePart : ""
    };
    digits : string[] = ["0","1","2","3","4","5","6","7","8","9"];
    alphabets : string[] = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    doubleOperatorCombinations : string[] = ["++","+=","--","-=","==","*=","!=",">=","<=","&&","||"];
    arithmeticOperators = ["+","-","*","/","%"];
    logicalOperator = ["&&","||","!"];
    relationalOperator = [">",">=","<","<=","==","!="];
    incDecOperator = ["++","--"];
    associativeOperator = ["=","+=","-=","*=","/="];
}