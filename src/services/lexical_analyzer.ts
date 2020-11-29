import { Path } from "../helpers/enums";
import { LanguageDefination } from "../helpers/language_defination";
import { FileSystem } from "./file_system";

export class LexicalAnalyzer{
    myLanguage : LanguageDefination = new LanguageDefination();
    fileSystem : FileSystem = new FileSystem();

    async Start(){
        console.log("I AM HERE",this.myLanguage.constant);
        let code = await this.fileSystem.ReadFile(Path.code);
        console.log(code);
        await this.fileSystem.WriteFile(code,Path.tokenSet,"token_set");
    }
    
}