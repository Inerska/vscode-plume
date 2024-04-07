"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const completionProvider_1 = require("./completion/completionProvider");
const connection = (0, vscode_languageserver_1.createConnection)(vscode_languageserver_1.ProposedFeatures.all);
const documents = new vscode_languageserver_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
documents.listen(connection);
connection.onInitialize(() => ({
    capabilities: {
        textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Incremental,
        completionProvider: {
            resolveProvider: true,
        },
    },
}));
connection.onCompletion(completionProvider_1.onCompletion);
connection.onCompletionResolve(completionProvider_1.onCompletionResolve);
connection.listen();
//# sourceMappingURL=server.js.map