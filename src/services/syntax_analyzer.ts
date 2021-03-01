import { ClassPart, Signs } from "../helpers/enums";
import { LanguageDefination } from "../helpers/language_defination";
import { Token } from "../models/token";
import { FileSystem } from "./file_system";
import { SelectionSets } from "./selection_sets";

export class SyntaxAnalyzer {
    private myLanguage: LanguageDefination = new LanguageDefination();
    private fileSystem: FileSystem = new FileSystem();
    private tokens: Token[] = [];
    private index : number = 0;
    private selectionSets : SelectionSets = new SelectionSets();
    private stack : string[];

    constructor(tokens : Token[]){
        this.tokens = tokens;
    }

    Init():string{
        if(this.StartingNonTerminal()){
            if(this.tokens[this.index].classPart === Signs.endPart){
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

    private StartingNonTerminal():boolean{
        return this.checkSyntax("startingNonTerminal");
    }

    checkSyntax(nonTerminal):boolean{
        let nestedNonTerminals = this.selectionSets.get(nonTerminal);
        if(nonTerminal === "functionReturnTypes" || nonTerminal === "functionParameterDT" || nonTerminal === "functionCallingParameter"){
            if(nestedNonTerminals.includes(this.tokens[this.index].classPart)){
                this.index++;
            }else{
                return false;
            }
        }else{
            if(nestedNonTerminals.length){
                for(let item of nestedNonTerminals){
                    let recursionRes = this.checkSyntax(item);
                    if(!recursionRes){
                        return false;
                    }
                }
            }else{
                if(nonTerminal === this.tokens[this.index].classPart){
                    this.index++;
                }else{
                    return false;
                }
            }
        }
        return true;
    }

    // addTerminalsToStackForChecking(nonTerminal : string){
    //     for(let item of this.selectionSets.get(nonTerminal)){
    //         console.log(item);
    //         if(this.selectionSets.get(item)){
    //             this.addTerminalsToStackForChecking(item);
    //         }else{
    //             this.stack.push(item);
    //         }
    //     }
    // }


}