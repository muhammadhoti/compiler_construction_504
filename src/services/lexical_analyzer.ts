import { ClassPart, Errors, Path, Regex } from "../helpers/enums";
import { LanguageDefination } from "../helpers/language_defination";
import { Token } from "../models/token";
import { FileSystem } from "./file_system";

export class LexicalAnalyzer {
    private myLanguage: LanguageDefination = new LanguageDefination();
    private fileSystem: FileSystem = new FileSystem();
    private sourceCode: string = "";
    private index = 0;
    private tokens: Token[] = [];
    private lineNumber = 1;
    private temp = "";
    private char = "";
    private isPuncuator = false;
    private isOperator = false;
    private isSingleLineComment: boolean = false;
    private isMultiLineComment: boolean = false;
    private waitingForCommentConfirmation: boolean = false;
    private waitingForDoubleOperators: boolean = false;
    private isString: boolean = false;
    private isChar: boolean = false;
    private isBackslash: boolean = false;

    async Init() {
        let codeFile = await this.fileSystem.ReadFile(Path.code);
        this.sourceCode = codeFile.toString()
        this.SplitWords();
        this.tokens.push({"classPart":"$","valuePart":this.myLanguage.endPart,line:this.lineNumber});
        await this.fileSystem.WriteFile(JSON.stringify(this.tokens), Path.tokenSet, "token_set.json");
        return this.tokens;
    }

    private SplitWords(): void {
        for (let char of this.sourceCode) {
            this.char = char;
            if (this.char === "\n") {
                this.NewLineEndOfFileEvent();
            } else if (this.char !== "\r") {
                this.IsPunctuator();
                if(!this.isPuncuator){
                    this.IsOperator();
                }
                if(this.waitingForDoubleOperators){
                    this.DismissDoubleOperatorsEvent();
                }

                if(this.waitingForCommentConfirmation){
                    this.DismissCommentConfirmationEvent();
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
                } else if (this.isOperator) {
                    this.OperatorEvent();
                } else {
                    if(!this.isString && !this.isChar && this.temp.includes(".") && !this.myLanguage.digits.includes(this.char)){
                        this.TokenizeWord(this.temp,this.lineNumber);
                        this.temp = this.char;
                    }else{
                        this.ConcatWithTemp();
                    }
                }
            }
            this.index++;
            this.isOperator = false;
            this.isPuncuator = false;
            if(this.sourceCode.length === this.index){
                this.NewLineEndOfFileEvent();
            }
        }
    }

    private DismissCommentConfirmationEvent(){
        if(this.char !== "/" && this.char !== "*"){
            if(this.temp){
                this.TokenizeWord(this.temp, this.lineNumber);
            }
            this.temp = "";
            this.waitingForCommentConfirmation = false;
        }
    }

    private DismissDoubleOperatorsEvent(){
        if(!this.isOperator){
            if(this.temp){
                this.TokenizeWord(this.temp, this.lineNumber);
            }
            this.temp = "";
            this.waitingForDoubleOperators = false;
        }
    }

    private OperatorEvent() {
        if (this.isChar || this.isString) {
            this.ConcatWithTemp();
        } else if(this.char === "/" || this.char === "*"){
            this.CommentEvent();
        } else {
            if(!this.isSingleLineComment && !this.isMultiLineComment){
                this.OperatorBreakerEvent();
            }
        }
    }

    private CommentEvent(){
        if (this.char === "/" && !this.isMultiLineComment) {
            this.SingleLineCommentEvent();
        } else {
            this.MultiLineCommentEvent();
        }
    }

    private SingleLineCommentEvent() {
        if (this.temp === "/") {
            this.temp = "";
            this.isSingleLineComment = true;
            this.waitingForCommentConfirmation = false;
        } else if (this.temp.includes("/")) {
            this.TokenizeWord(this.temp.slice(0, this.temp.length - 1), this.lineNumber);
            this.temp = "";
            this.isSingleLineComment = true;
            this.waitingForCommentConfirmation = false;
        } else if(!this.isSingleLineComment){
            if(this.temp){
                this.TokenizeWord(this.temp, this.lineNumber);
                this.temp = "";
            }
            this.ConcatWithTemp();
            this.waitingForCommentConfirmation = true;
        }
    }

    private MultiLineCommentEvent() {
        if (this.temp === "/" && this.char === "*") {
            this.temp = "";
            this.isMultiLineComment = true;
            this.waitingForCommentConfirmation = false;
        } else if (this.char === "*" && this.temp.includes("/")) {
            this.TokenizeWord(this.temp.slice(0, this.temp.length - 1), this.lineNumber);
            this.temp = "";
            this.isMultiLineComment = true;
            this.waitingForCommentConfirmation = false;
        } else if (this.isMultiLineComment && this.char === "/" && this.sourceCode[this.index - 1] === "*") {
            this.isMultiLineComment = false;
        } else {
            this.OperatorBreakerEvent();
        }
    }

    private OperatorBreakerEvent(){
        if(this.waitingForDoubleOperators){
            if(this.IsDoubleOperator(this.temp+this.char)){
                this.TokenizeWord(this.temp+this.char, this.lineNumber);
                this.temp = "";
                this.waitingForDoubleOperators = false;
            }else{
                this.TokenizeWord(this.temp, this.lineNumber);
                this.temp = "";
                this.ConcatWithTemp();
                this.waitingForDoubleOperators = true;
            }
        }else{
            if(this.temp){
                this.TokenizeWord(this.temp, this.lineNumber);
                this.temp = "";
            }
            this.ConcatWithTemp();
            this.waitingForDoubleOperators = true;
        }
    }

    private ConcatWithTemp() {
        if (!this.isSingleLineComment && !this.isMultiLineComment) {
            this.temp = this.temp + this.char;
        }
    }

    private PuncuatorEvent() {
        if (this.char === "." && !this.isChar && !this.isString) {
            this.DotPuncuatorEvent();
        } else if (this.char !== '"' && this.char !== "'" && !this.isChar && !this.isString) {
            this.PuncuatorBreakEvent();
        } else if (this.char === "'" || this.char === '"') {
            this.StringCharPuncuatorEvent();
        }
    }

    private DotPuncuatorEvent() {
        if (new RegExp(this.myLanguage.digits.join("|")).test(this.sourceCode[this.index + 1])) {
            this.ConcatWithTemp();
        } else if (!new RegExp(this.myLanguage.alphabets.join("|")).test(this.temp) && this.temp) {
            this.ConcatWithTemp();
        } else {
            this.PuncuatorBreakEvent();
        }
    }

    private PuncuatorBreakEvent() {
        this.TokenizeWord(this.char, this.lineNumber);
        this.temp = "";
    }

    private StringCharPuncuatorEvent() {
        if (this.char === '"') {
            this.StringPuncuatorEvent();
        } else {
            this.CharPuncuatorEvent();
        }
    }

    private StringPuncuatorEvent() {
        if (!this.isString) {
            this.temp = this.temp + this.char;
            this.isString = true;
        } else if (this.isString) {
            this.isString = false;
            this.temp = this.temp + this.char;
            this.TokenizeWord(this.temp, this.lineNumber)
            this.temp = "";
        }
    }

    private CharPuncuatorEvent() {
        if (!this.isChar) {
            this.temp = this.temp + this.char;
            this.isChar = true;
        } else if (this.isChar) {
            this.isChar = false;
            this.temp = this.temp + this.char;
            this.TokenizeWord(this.temp, this.lineNumber);
            this.temp = "";
        }
    }

    private SpacePunctuatorBreakEvent() {
        if (this.temp && this.temp !== " " && !this.isString && !this.isChar && !this.IsDouble()) {
            this.TokenizeWord(this.temp, this.lineNumber);
            this.temp = "";
        } else if ((this.isString || this.isChar) && !this.isPuncuator) {
            this.ConcatWithTemp();
        }
    }

    private IsDouble(): boolean {
        if (this.char === "." && new RegExp(this.myLanguage.digits.join("|")).test(this.temp) && !new RegExp(this.myLanguage.alphabets.join("|")).test(this.temp) && !this.temp.includes(".")) {
            return true;
        }

        return false;
    }

    private BackslashEvent(){
        this.ConcatWithTemp();
        this.isBackslash = true;
    }

    private BackslashForceConcatEvent(){
        this.ConcatWithTemp();
        this.isBackslash = false;
    }

    private NewLineEndOfFileEvent() {
        if (!this.isSingleLineComment && !this.isMultiLineComment) {
            if (this.temp && this.temp !== " ") {
                this.TokenizeWord(this.temp, this.lineNumber, true);
            }
        }
        this.lineNumber++;
        this.isSingleLineComment = false;
        this.isString = false;
        this.isChar = false;
        this.isBackslash = false;
        this.temp = "";
    }

    private IsPunctuator(): void {
        let index = this.myLanguage.punctuators.findIndex(x => x.valuePart === this.char);
        if (index === -1 || this.char === "\\") {
            this.isPuncuator = false
        }else{
            this.isPuncuator = true;
        }
    }

    private IsOperator(): void {
        let index = this.myLanguage.operators.findIndex(x => x.valuePart === this.char);
        if (index === -1) {
            this.isOperator = false;
        }else{
            this.isOperator = true;
        }
    }

    private IsDoubleOperator(combination:string): boolean {
        let index = this.myLanguage.doubleOperatorCombinations.findIndex(x => x === combination);
        if (index === -1) {
            return false
        }
        return true;
    }

    private TokenizeWord(word: string, lineNumber: number, fromLineBreak = false): void {
        let token =
        {
            "classPart": this.GetClassPart(word, fromLineBreak),
            "valuePart": word,
            "line": lineNumber
        }
        this.tokens.push(token);
    }

    private IsKeyword(word:string): boolean {
        let index = this.myLanguage.keywords.findIndex(x => x.valuePart === word);
        if (index === -1) {
            return false
        }
        return true;
    }

    private GetClassPart(word: string, fromLineBreak = false): string {
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
        if (word[0] === '"' && word[word.length-1] !== '"') {
            return Errors.invalidLexue;
        }
        if (word[0] === "'" && word[word.length-1] !== "'") {
            return Errors.invalidLexue;
        }
        if (word[0] === '"' && word[word.length-1] === '"') {
            return ClassPart.string;
        }
        if (word[0] === "'" && word[word.length-1] === "'") {
            return ClassPart.char;
        }

        if(this.myLanguage.punctuators.findIndex(x => x.valuePart === word) !== -1){
            return word;
        }

        if(this.myLanguage.arithmeticOperators.findIndex(x => x === word) !== -1){
            return ClassPart.arithmeticOperator;
        }
        if(this.myLanguage.logicalOperator.findIndex(x => x === word) !== -1){
            return ClassPart.logicalOperator;
        }
        if(this.myLanguage.relationalOperator.findIndex(x => x === word) !== -1){
            return ClassPart.relationalOperator;
        }if(this.myLanguage.incDecOperator.findIndex(x => x === word) !== -1){
            return ClassPart.incDecOperator;
        }if(this.myLanguage.associativeOperator.findIndex(x => x === word) !== -1){
            return ClassPart.associativeOperator;
        }
        
        if(word.match(Regex.number)){
            if(word.match(Regex.double)){
                return ClassPart.double;
            }
            if(word.match(Regex.int)){
                return ClassPart.int;
            }
        }
        if(word.match(Regex.identifier)){
            if(this.IsKeyword(word)){
                return word;
            }else{
                return ClassPart.identifier;
            }
        }

        return Errors.invalidLexue;
    }

}