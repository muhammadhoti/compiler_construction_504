import { LexicalAnalyzer } from "./services/services";


class App {
    public static async start() {
        let lexicalAnalyzer : LexicalAnalyzer = new LexicalAnalyzer();
        await lexicalAnalyzer.Start();
    }
}

App.start();
