import { Errors, Path } from "../helpers/enums";
import { LanguageDefination } from "../helpers/language_defination";
import { Token } from "../models/token";
import { FileSystem } from "./file_system";

export class LexicalAnalyzer {
    myLanguage: LanguageDefination = new LanguageDefination();
    fileSystem: FileSystem = new FileSystem();
    sourceCode: string = "";
    index = 0;
    tokens: Token[] = [];
    lineNumber = 1;
    temp = "";
    char = "";
    isPuncuator = false;
    isOperator = false;
    isSingleLineComment: boolean = false;
    isMultiLineComment: boolean = false;
    waitingForCommentConfirmation: boolean = false;
    isString: boolean = false;
    isChar: boolean = false;
    isBackslash: boolean = false;

    async Start() {
        let codeFile = await this.fileSystem.ReadFile(Path.code);
        this.sourceCode = codeFile.toString()
        this.SplitWords();
        await this.fileSystem.WriteFile(JSON.stringify(this.tokens), Path.tokenSet, "token_set.json");
    }

    SplitWords(): void {
        for (let char of this.sourceCode) {
            this.char = char;
            if (this.char === "\n") {
                this.NewLineEndOfFileEvent();
            } else if (this.char !== "\r") {
                this.IsPunctuator();
                if(!this.isPuncuator){
                    this.IsOperator();
                }
                if(this.waitingForCommentConfirmation){
                    if(this.char !== "/"){
                        this.tokens.push(this.TokenizeWord(this.temp, this.lineNumber));
                        this.temp = "";
                        this.waitingForCommentConfirmation = false;
                    }
                }
                if((this.isString || this.isChar) && this.char === "\\" && !this.isBackslash){
                    this.BackslashEvent();
                } else if((this.isString || this.isChar) && this.isBackslash){
                    this.BackslashForceConcatEvent();
                } else if((!this.isOperator || !this.isString || !this.isChar) && (this.char === " " || (this.isPuncuator && ((!this.isString || this.char === '"') || (!this.isChar || this.char === '"'))))) {
                    if(!this.isSingleLineComment && !this.isMultiLineComment){
                        this.SpacePunctuatorBreakEvent();
                    }
                    if (this.isPuncuator && !this.isSingleLineComment && !this.isMultiLineComment) {
                        this.PuncuatorEvent();
                    }
                } else if (this.isOperator && !this.isSingleLineComment && !this.isMultiLineComment) {
                    this.OperatorEvent();
                } else {
                    this.ConcatWithTemp();
                }
            }
            this.index++;
            if(this.sourceCode.length === this.index){
                this.NewLineEndOfFileEvent();
            }
        }
    }

    OperatorEvent() {
        if (this.isChar || this.isString) {
            this.ConcatWithTemp();
        } else if(this.char === "/" || this.char === "*"){
            this.CommentEvent();
        } else {
            this.OperatorBreakerEvent();
        }
    }

    CommentEvent(){
        if (this.char === "/" && !this.isMultiLineComment) {
            this.SingleLineCommentEvent();
        } else {
            this.MultiLineCommentEvent();
        }
    }

    SingleLineCommentEvent() {
        if (this.temp === "/") {
            this.temp = "";
            this.isSingleLineComment = true;
            this.waitingForCommentConfirmation = false;
        } else if (this.temp.includes("/")) {
            this.tokens.push(this.TokenizeWord(this.temp.slice(0, this.temp.length - 1), this.lineNumber));
            this.temp = "";
            this.isSingleLineComment = true;
            this.waitingForCommentConfirmation = false;
        } else{
            if(this.temp){
                this.tokens.push(this.TokenizeWord(this.temp, this.lineNumber));
                this.temp = "";
            }
            this.ConcatWithTemp();
            this.waitingForCommentConfirmation = true;
        }
    }

    MultiLineCommentEvent() {
        if (this.temp === "/" && this.char === "*") {
            this.temp = "";
            this.isMultiLineComment = true;
        } else if (this.char === "*" && this.temp.includes("/")) {
            this.tokens.push(this.TokenizeWord(this.temp.slice(0, this.temp.length - 1), this.lineNumber));
            this.temp = "";
            this.isMultiLineComment = true;
        } else if (this.isMultiLineComment && this.char === "/" && this.sourceCode[this.index - 1] === "*") {
            this.isMultiLineComment = false;
        } else {
            this.ConcatWithTemp();
        }
    }

    OperatorBreakerEvent(){
        if(this.temp){
            this.tokens.push(this.TokenizeWord(this.temp, this.lineNumber));
            this.temp = "";
        }
        this.tokens.push(this.TokenizeWord(this.char, this.lineNumber));
    }

    ConcatWithTemp() {
        if (!this.isSingleLineComment && !this.isMultiLineComment) {
            this.temp = this.temp + this.char;
        }
    }

    PuncuatorEvent() {
        if (this.char === "." && !this.isChar && !this.isString) {
            this.DotPuncuatorEvent();
        } else if (this.char !== '"' && this.char !== "'" && !this.isChar && !this.isString) {
            this.PuncuatorBreakEvent();
        } else if (this.char === "'" || this.char === '"') {
            this.StringCharPuncuatorEvent();
        }
    }

    DotPuncuatorEvent() {
        if (new RegExp(this.myLanguage.digits.join("|")).test(this.sourceCode[this.index + 1])) {
            this.ConcatWithTemp();
        } else if (!new RegExp(this.myLanguage.alphabets.join("|")).test(this.temp) && this.temp) {
            this.ConcatWithTemp();
        } else {
            this.PuncuatorBreakEvent();
        }
    }

    PuncuatorBreakEvent() {
        this.tokens.push(this.TokenizeWord(this.char, this.lineNumber));
        this.temp = "";
    }

    StringCharPuncuatorEvent() {
        if (this.char === '"') {
            this.StringPuncuatorEvent();
        } else {
            this.CharPuncuatorEvent();
        }
    }

    StringPuncuatorEvent() {
        if (!this.isString) {
            this.temp = this.temp + this.char;
            this.isString = true;
        } else if (this.isString) {
            this.isString = false;
            this.temp = this.temp + this.char;
            this.tokens.push(this.TokenizeWord(this.temp, this.lineNumber));
            this.temp = "";
        }
    }

    CharPuncuatorEvent() {
        if (!this.isChar) {
            this.temp = this.temp + this.char;
            this.isChar = true;
        } else if (this.isChar) {
            this.isChar = false;
            this.temp = this.temp + this.char;
            this.tokens.push(this.TokenizeWord(this.temp, this.lineNumber));
            this.temp = "";
        }
    }

    SpacePunctuatorBreakEvent() {
        if (this.temp && this.temp !== " " && !this.isString && !this.isChar && !this.IsFloat()) {
            this.tokens.push(this.TokenizeWord(this.temp, this.lineNumber));
            this.temp = "";
        } else if ((this.isString || this.isChar) && !this.isPuncuator) {
            this.ConcatWithTemp();
        }
    }

    IsFloat(): boolean {
        if (this.char === "." && new RegExp(this.myLanguage.digits.join("|")).test(this.temp) && !new RegExp(this.myLanguage.alphabets.join("|")).test(this.temp) && !this.temp.includes(".")) {
            return true;
        }

        return false;
    }

    BackslashEvent(){
        this.ConcatWithTemp();
        this.isBackslash = true;
    }

    BackslashForceConcatEvent(){
        this.ConcatWithTemp();
        this.isBackslash = false;
    }

    NewLineEndOfFileEvent() {
        if (!this.isSingleLineComment && !this.isMultiLineComment) {
            if (this.temp && this.temp !== " ") {
                this.tokens.push(this.TokenizeWord(this.temp, this.lineNumber, true));
            }
        }
        this.lineNumber++;
        this.isSingleLineComment = false;
        this.isString = false;
        this.isChar = false;
        this.isBackslash = false;
        this.temp = "";
    }

    IsPunctuator(): void {
        let index = this.myLanguage.punctuators.findIndex(x => x.valuePart === this.char);
        if (index === -1 || this.char === "\\") {
            this.isPuncuator = false
        }else{
            this.isPuncuator = true;
        }
    }

    IsOperator(): void {
        let i = 0;
        let index = this.myLanguage.operators.findIndex(x => x.valuePart === this.char);
        if (index === -1) {
            this.isOperator = false
        }else{
            this.isOperator = true;
        }
    }

    TokenizeWord(word: string, lineNumber: number, fromLineBreak = false): Token {
        let token =
        {
            "classPart": this.GetClassPart(word, fromLineBreak),
            "valuePart": word,
            "line": lineNumber
        }
        return token;
    }

    GetClassPart(word: string, fromLineBreak = false): string {
        if (fromLineBreak) {
            if (word[0] === '"' || word[0] === "'") {
                return Errors.invalidLexue;
            }
        }
        if (word[0] === "'" && word.length > 3) {
            if (word.length !== 4 || word[1] !== "\\") {
                return Errors.invalidLexue;
            }
        }
        return word;
    }

}