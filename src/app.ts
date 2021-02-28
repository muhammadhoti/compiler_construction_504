import { Token } from "./models/models";
import { LexicalAnalyzer } from "./services/services";


class App {
    public static async start() {
        let lexicalAnalyzer : LexicalAnalyzer = new LexicalAnalyzer();
        let tokens : Token[] = await lexicalAnalyzer.Init();
        console.log(`${tokens.length} Tokens Found`);
    }
}

App.start();
