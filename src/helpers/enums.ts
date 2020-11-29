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

export enum Regex {
    identifier ="^([a-zA-Z_$][a-zA-Z\d_$]*)$",
    constant = "-?\d+(?:\.\d+)?"
}