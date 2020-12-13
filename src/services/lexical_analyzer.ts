import { Errors, Path } from "../helpers/enums";
import { LanguageDefination } from "../helpers/language_defination";
import { Token } from "../models/token";
import { FileSystem } from "./file_system";

export class LexicalAnalyzer{
    myLanguage : LanguageDefination = new LanguageDefination();
    fileSystem : FileSystem = new FileSystem();
    i = 0;
    tokens : Token[] = [];
    lineNumber = 1;
    temp = "";
    isComment : boolean = false;
    isMultiComment : boolean = false;
    isString : boolean = false;
    isChar : boolean = false;

    async Start(){
        let sourceCode = await (await this.fileSystem.ReadFile(Path.code)).toString();
        this.SplitWords(sourceCode);
        await this.fileSystem.WriteFile(JSON.stringify(this.tokens),Path.tokenSet,"token_set.json");
    }

    SplitWords(sourceCode :string) : void{
        for(let char of sourceCode){
            if(char === "\n"){
                this.NewLineEvent();
            }else if(char !== "\r"){
                let isPuncuator = this.IsPunctuator(char);
                if(char === " " || isPuncuator && ((!this.isString || char === '"') || (!this.isChar || char === '"'))){
                    this.SpacePunctuatorBreakEvent(char);
                    if(isPuncuator){
                        this.PuncuatorEvent(char);
                    }
                }else{
                    this.NormalEvent(char);
                }
            }
            this.i++;
        }
    }

    
    PuncuatorEvent(char:string){
        if(char !== '"' && char !== "'"){
            this.tokens.push(this.TokenizeWord(char,this.lineNumber));
            this.temp = "";
        }else if(char === "'" || char === '"'){
            this.StringCharPuncuatorEvent(char);
        }
    }

    StringCharPuncuatorEvent(char){
        if(char === '"'){
            this.StringPuncuatorEvent(char);
        }else{
            this.CharPuncuatorEvent(char);
        }
    }

    StringPuncuatorEvent(char : string){
        if(!this.isString){
            this.temp = this.temp + char;
            this.isString = true;
        }else if(this.isString){
            this.isString = false;
            this.temp = this.temp + char;
            this.tokens.push(this.TokenizeWord(this.temp,this.lineNumber));
            this.temp = "";
        }
    }

    CharPuncuatorEvent(char:string){
        if(!this.isChar){
            this.temp = this.temp + char;
            this.isChar = true;
        }else if(this.isChar){
            this.isChar = false;
            this.temp = this.temp + char;
            this.tokens.push(this.TokenizeWord(this.temp,this.lineNumber));
            this.temp = "";
        }
    }

    SpacePunctuatorBreakEvent(char : string){
        if(this.temp && this.temp !== " " && !this.isString && !this.isChar){
            this.tokens.push(this.TokenizeWord(this.temp,this.lineNumber));
            this.temp = "";
        }else if(char === " " && (this.isString || this.isChar)){
            this.temp = this.temp + char;
        }
    }

    NormalEvent(char: string){
        if(!this.isComment && !this.isMultiComment){
            this.temp = this.temp + char;
        }
    }

    NewLineEvent(){
        if(!this.isComment && !this.isMultiComment){
            if(this.temp && this.temp !== " "){
                let token : Token = this.TokenizeWord(this.temp,this.lineNumber,true);
                this.tokens.push(token);
            }
        }
        this.lineNumber++;
        this.isComment = false;
        this.isString = false;
        this.isChar = false;
        this.temp = "";
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