import { Errors, Path } from "../helpers/enums";
import { LanguageDefination } from "../helpers/language_defination";
import { Token } from "../models/token";
import { FileSystem } from "./file_system";

export class LexicalAnalyzer{
    myLanguage : LanguageDefination = new LanguageDefination();
    fileSystem : FileSystem = new FileSystem();

    async Start(){
        let sourceCode = await (await this.fileSystem.ReadFile(Path.code)).toString();
        let tokens = this.SplitWords(sourceCode);
        await this.fileSystem.WriteFile(JSON.stringify(tokens),Path.tokenSet,"token_set.json");
    }

    SplitWords(sourceCode :string) : Token[]{
        let i = 0;
        let tokens : Token[] = [];
        let lineNumber = 1;
        let temp = "";
        let isComment : boolean = false;
        let isMultiComment : boolean = false;
        let isString : boolean = false;
        let isChar : boolean = false;
        let token : Token;
        for(let char of sourceCode){
            if(char === "\n"){
                if(!isComment && !isMultiComment){
                    if(temp && temp !== " "){
                        token = this.TokenizeWord(temp,lineNumber,true);
                        tokens.push(token);
                    }
                }
                lineNumber++;
                isComment = false;
                isString = false;
                isChar = false;
                temp = "";
            }else if(char !== "\r"){
                if(char === " " || this.IsPunctuator(char) && ((!isString || char === '"') || (!isChar || char === '"'))){
                    if(temp && temp !== " " && !isString && !isChar){
                        token = this.TokenizeWord(temp,lineNumber);
                        tokens.push(token);
                        temp = "";
                    }else if(char === " " && (isString || isChar)){
                        temp = temp + char;
                    }
                    if(this.IsPunctuator(char)){
                        if(char !== '"' && char !== "'"){
                            token = this.TokenizeWord(char,lineNumber);
                            tokens.push(token);
                            temp = "";
                        }else{
                            if(!isString && char === '"'){
                                temp = temp + char;
                                isString = true;
                            }else if(isString && char === '"'){
                                isString = false;
                                temp = temp + char;
                                token = this.TokenizeWord(temp,lineNumber);
                                tokens.push(token);
                                temp = "";
                            }
                            if(!isChar && char === "'"){
                                temp = temp + char;
                                isChar = true;
                            }else if(isChar && char === "'"){
                                isChar = false;
                                temp = temp + char;
                                token = this.TokenizeWord(temp,lineNumber);
                                tokens.push(token);
                                temp = "";
                            }
                        }
                    }
                }else{
                    if(!isComment && !isMultiComment){
                        temp = temp + char;
                    }
                }
            }
            i++;
        }
        return tokens;
    }

    IsPunctuator(char :string):boolean{
        let index = this.myLanguage.punctuators.findIndex(x=> x.valuePart === char);
        if(index === -1){
            return false
        }
        return true;
    }

    TokenizeWord(word :string,lineNumber : number,fromLineBreak = false) : Token{
        let token =
            {
                "classPart" : this.GetClassPart(word,fromLineBreak),
                "valuePart" : word,
                "line" : lineNumber
            }
        return token;
    }

    GetClassPart(word :string,fromLineBreak = false) : string{
        if(fromLineBreak){
            if(word[0] === '"' || word[0] === "'"){
                return Errors.invalidLexue;
            }
        }
        if(word[0] === "'" && word.length > 3){
            return Errors.invalidLexue;
        }
        return word;
    }
    
}