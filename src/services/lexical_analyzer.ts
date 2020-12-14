import { Errors, Path } from "../helpers/enums";
import { LanguageDefination } from "../helpers/language_defination";
import { Token } from "../models/token";
import { FileSystem } from "./file_system";

export class LexicalAnalyzer{
    myLanguage : LanguageDefination = new LanguageDefination();
    fileSystem : FileSystem = new FileSystem();
    sourceCode : string = "";
    index = 0;
    tokens : Token[] = [];
    lineNumber = 1;
    temp = "";
    char = "";
    isSingleLineComment : boolean = false;
    isMultiLineComment : boolean = false;
    isString : boolean = false;
    isChar : boolean = false;
    isBackslash : boolean = false;

    async Start(){
        let codeFile = await this.fileSystem.ReadFile(Path.code);
        this.sourceCode = codeFile.toString()
        this.SplitWords();
        await this.fileSystem.WriteFile(JSON.stringify(this.tokens),Path.tokenSet,"token_set.json");
    }

    SplitWords() : void{
        for(let char of this.sourceCode){
            this.char = char;
            if(this.char === "\n"){
                this.NewLineEvent();
            }else if(this.char !== "\r"){
                let isPuncuator = this.IsPunctuator();
                if(this.char === " " || isPuncuator && ((!this.isString || this.char === '"') || (!this.isChar || this.char === '"'))){
                    this.SpacePunctuatorBreakEvent();
                    if(isPuncuator && !this.isSingleLineComment && !this.isMultiLineComment){
                        this.PuncuatorEvent();
                    }
                }else if(this.char === "/" || this.char === "*"){
                    this.CommentEvent();
                }else{
                    this.ConcatChar();
                }
            }
            this.index++;
        }
    }

    CommentEvent(){
        if(!this.isChar && !this.isString){
            if(this.char === "/"  && !this.isMultiLineComment){
                this.SingleLineCommentEvent();
            }else{
                this.MultiLineCommentEvent();
            }
        }else{
            this.ConcatChar();
        }
    }

    SingleLineCommentEvent(){
        if(this.temp === "/"){
            this.temp = "";
            this.isSingleLineComment = true;
        }else if(this.temp.includes("/")){
            this.tokens.push(this.TokenizeWord(this.temp.slice(0,this.temp.length-1),this.lineNumber));
            this.temp = "";
            this.isSingleLineComment = true;
        }else{
            this.ConcatChar();
        }
    }

    MultiLineCommentEvent(){
        if(this.temp === "/" && this.char === "*"){
            this.temp = "";
            this.isMultiLineComment = true;
        }else if(this.char === "*" && this.temp.includes("/")){
            this.tokens.push(this.TokenizeWord(this.temp.slice(0,this.temp.length-1),this.lineNumber));
            this.temp = "";
            this.isMultiLineComment = true;
        }else if(this.isMultiLineComment && this.char === "/" && this.sourceCode[this.index -1] === "*"){
            this.isMultiLineComment = false;
        }else{
            this.ConcatChar();
        }
    }

    ConcatChar(){
        if(!this.isSingleLineComment && !this.isMultiLineComment){
            this.temp = this.temp + this.char;
        }
    }
    
    PuncuatorEvent(){
        if(this.char === "."){
            this.DotPuncuatorEvent();
        }else if(this.char !== '"' && this.char !== "'"){
            this.PuncuatorBreakEvent();
        }else if(this.char === "'" || this.char === '"'){
            this.StringCharPuncuatorEvent();
        }
    }

    DotPuncuatorEvent(){
        if(new RegExp(this.myLanguage.digits.join("|")).test(this.sourceCode[this.index + 1])) {
            this.ConcatChar();
        }else if(!new RegExp(this.myLanguage.alphabets.join("|")).test(this.temp) && this.temp){
            this.ConcatChar();
        }else{
            this.PuncuatorBreakEvent();
        }
    }

    PuncuatorBreakEvent(){
        this.tokens.push(this.TokenizeWord(this.char,this.lineNumber));
            this.temp = "";
    }

    StringCharPuncuatorEvent(){
        if(this.char === '"'){
            this.StringPuncuatorEvent();
        }else{
            this.CharPuncuatorEvent();
        }
    }

    StringPuncuatorEvent(){
        if(!this.isString){
            this.temp = this.temp + this.char;
            this.isString = true;
        }else if(this.isString){
            this.isString = false;
            this.temp = this.temp + this.char;
            this.tokens.push(this.TokenizeWord(this.temp,this.lineNumber));
            this.temp = "";
        }
    }

    CharPuncuatorEvent(){
        if(!this.isChar){
            this.temp = this.temp + this.char;
            this.isChar = true;
        }else if(this.isChar){
            this.isChar = false;
            this.temp = this.temp + this.char;
            this.tokens.push(this.TokenizeWord(this.temp,this.lineNumber));
            this.temp = "";
        }
    }

    SpacePunctuatorBreakEvent(){
        if(this.temp && this.temp !== " " && !this.isString && !this.isChar && !this.IsFloat()){
            this.tokens.push(this.TokenizeWord(this.temp,this.lineNumber));
            this.temp = "";
        }else if(this.char === " " && (this.isString || this.isChar)){
            this.ConcatChar();
        }
    }

    IsFloat():boolean{
        
        if(this.char === "." && new RegExp(this.myLanguage.digits.join("|")).test(this.temp) && !new RegExp(this.myLanguage.alphabets.join("|")).test(this.temp) && !this.temp.includes(".")){
            return true;
        }

        return false;
    }

    NewLineEvent(){
        if(!this.isSingleLineComment && !this.isMultiLineComment){
            if(this.temp && this.temp !== " "){
                let token : Token = this.TokenizeWord(this.temp,this.lineNumber,true);
                this.tokens.push(token);
            }
        }
        this.lineNumber++;
        this.isSingleLineComment = false;
        this.isString = false;
        this.isChar = false;
        this.isBackslash = false;
        this.temp = "";
    }

    IsPunctuator():boolean{
        let index = this.myLanguage.punctuators.findIndex(x=> x.valuePart === this.char);
        if(index === -1 || this.char === "\\"){
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
            if(word.length !== 4 || word[1] !== "\\"){
                return Errors.invalidLexue;
            }
        }
        return word;
    }
    
}