import { Token } from "./models/models";
import { LexicalAnalyzer, SyntaxAnalyzer } from "./services/services";


class App {
    public static async start() {
        let lexicalAnalyzer : LexicalAnalyzer = new LexicalAnalyzer();
        let tokens : Token[] = await lexicalAnalyzer.Init();
        console.log(`${tokens.length-1} Tokens Found`);
        let syntaxAnalyzer : SyntaxAnalyzer = new SyntaxAnalyzer(tokens);
        console.log(syntaxAnalyzer.Init());
    }
}

App.start();
