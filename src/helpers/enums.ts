export enum Errors {
    invalidLexue= "invalidLexue"
}

export enum Path {
    code = "src\\input\\code.txt",
    tokenSet = "src\\output"
}

export enum LanguageDefinedConstantTypes {
    keyword= "keyword",
    operator= "operator",
    punctuator = "punctuator",
    identifier = "identifier",
    constant = "constant",
    comment = "comment"
}

export const Regex = {
    identifier : /^([a-zA-Z_$][a-zA-Z\d_$]*)$/,
    number : /-?\d+(?:\.\d+)?/,
    int : /^\d+$/,
    double : /[0-9]*\.[0-9]*/,
    alphabets : /^[A-Za-z]+$/
}

export enum ClassPart {
    identifier ="ID",
    int="integer_const",
    double="double_const",
    string="string_const",
    char="char_const",
    arithmeticOperator = "ARO",
    logicalOperator = "LO",
    relationalOperator = "RO",
    associativeOperator = "ASO",
    incDecOperator = "IDO"
}