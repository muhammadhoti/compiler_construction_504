import { ClassPart, Errors, Path, Regex } from "../helpers/enums";
import { LanguageDefination } from "../helpers/language_defination";
import { Token } from "../models/token";
import { FileSystem } from "./file_system";

export class SyntaxAnalyzer {
    private myLanguage: LanguageDefination = new LanguageDefination();
    private fileSystem: FileSystem = new FileSystem();
    private sourceCode: string = "";
    private tokens: Token[] = [];
    private index : number = 0;

    constructor(tokens : Token[]){
        this.tokens = tokens;
    }

    Init():string{
        if(this.S()){
            if(this.tokens[this.index].classPart === this.myLanguage.endPart){
                return "No Syntax Error";
            }else{
                return this.notifyError();
            }
        }
        return this.notifyError();
    }

    private notifyError():string{
        return `Syntax Error At Line #${this.tokens[this.index].line}`;
    }

    private S():boolean{
        return true;
    }


}