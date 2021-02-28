import { ClassPart, Errors, Path, Regex } from "../helpers/enums";
import { LanguageDefination } from "../helpers/language_defination";
import { Token } from "../models/token";
import { FileSystem } from "./file_system";

export class SyntaxAnalyzer {
    myLanguage: LanguageDefination = new LanguageDefination();
    fileSystem: FileSystem = new FileSystem();
    sourceCode: string = "";
    tokens: Token[] = [];

    constructor(tokens : Token[]){
        this.tokens = tokens;
    }

    Init() {
        console.log(this.tokens);
    }


}