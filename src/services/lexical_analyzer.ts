import { Path } from "../helpers/enums";
import { LanguageDefination } from "../helpers/language_defination";
import { Token } from "../models/token";
import { FileSystem } from "./file_system";

export class LexicalAnalyzer{
    myLanguage : LanguageDefination = new LanguageDefination();
    fileSystem : FileSystem = new FileSystem();

    async Start(){
        let sourceCode = await (await this.fileSystem.ReadFile(Path.code)).toString();
        let tokens = this.SplitWords(sourceCode);
        await this.fileSystem.WriteFile(JSON.stringify(tokens),Path.tokenSet,"token_set");
    }

    SplitWords(sourceCode :string) : Token[]{
        let tokens : Token[] = [];
        let lineNumber = 1;
        let temp = "";
        for(let i = 0; i <sourceCode.length; i++){
            console.log(sourceCode[i])
            if(sourceCode[i] === "\n"){
                lineNumber++;
            }else if(sourceCode[i] !== "\r"){
                let token = this.TokenizeWord(sourceCode[i],lineNumber);
                tokens.push(token);
            }
        }
        console.log(lineNumber);
        return tokens;
    }

    TokenizeWord(word :string,lineNumber : number) : Token{
        let token =
            {
                "classPart" : this.GetClassPart(word),
                "valuePart" : word,
                "line" : lineNumber
            }
        return token;
    }

    GetClassPart(word :string) : string{
        
        return word;
    }
    
}