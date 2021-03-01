import { ClassPart, LanguageDefinedConstantTypes } from "../helpers/enums";

export class SelectionSets {
    public get(type) : any[]{
        if(this.selectionSets[type]){
            return this.selectionSets[type] as any[];
        }else{
            return [];
        }
    }
    selectionSets : any = {
        "startingNonTerminal" : [
            "accessModifier",
            "class",
            ClassPart.identifier,
            "{",
            "classBody",
            "}"
        ],
        "classBody":[
            "functionDefination"
        ],
        "functionDefination":[
            "accessModifier",
            "functionReturnTypes", //Choices
            ClassPart.identifier,
            "(",
            "functionParameters",
            ")",
            "{",
            "functionBody",
            "}"
        ],
        "functionReturnTypes":[
            "int",
            "double",
            "string",
            "char",
            "boolean",
            "void"
        ],
        "functionParameters" : [
            "functionParameterDT", //Choices
            ClassPart.identifier,
        ],
        "functionParameterDT":[
            "int",
            "double",
            "string",
            "char",
            "boolean",
        ],
        "functionBody" : [
            "SST"
        ],
        "SST":[
            "expression"
        ],
        "expression":[
            ClassPart.identifier,
            ".",
            ClassPart.identifier,
            ".",
            ClassPart.identifier,
            "(",
            "functionCallingParameter",//Choices
            ")",
            ";"
        ],
        "functionCallingParameter":[
            ClassPart.int,
            ClassPart.string,
            ClassPart.double,
            ClassPart.char
        ]
    };
    
}