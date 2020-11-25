import { LexicalAnalyzer } from "./services/lexical_analyzer";

class App {
    public static start() {
        let lexicalAnalyzer : LexicalAnalyzer = new LexicalAnalyzer();
        lexicalAnalyzer.Start();
    }
}

App.start();
