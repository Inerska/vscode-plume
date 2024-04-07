'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
let connection = (0, vscode_languageserver_1.createConnection)(vscode_languageserver_1.ProposedFeatures.all);
let documents = new vscode_languageserver_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
documents.listen(connection);
let workspaceRoot;
connection.onInitialize((params) => {
    let workspaceRoot = params.workspaceFolders;
    return {
        capabilities: {
            textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true
            },
            hoverProvider: true
        }
    };
});
const keywords = [
    'type', 'extend', 'with', 'return', 'switch', 'case', 'require',
    'map', 'and_then', 'pure', 'satisfy', 'character', 'string', 'infixr', 'operator'
];
const types = [
    'user', 'str', 'int', 'ParserResult', 'Parser', 'Option', 'char', 'Result', 'Ok', 'Error'
];
const functions = [
    'to_str', 'facto', 'eval_parser', 'extract_head', 'run_parser', 'throwParser',
    'throw_result', 'println'
];
connection.onCompletion((textDocumentPosition) => {
    const completionItems = [];
    const uri = textDocumentPosition.textDocument.uri;
    keywords.forEach(keyword => {
        completionItems.push({
            label: keyword,
            kind: vscode_languageserver_1.CompletionItemKind.Keyword,
            data: { uri }
        });
    });
    types.forEach(type => {
        completionItems.push({
            label: type,
            kind: vscode_languageserver_1.CompletionItemKind.Class
        });
    });
    functions.forEach(func => {
        completionItems.push({
            label: func,
            kind: vscode_languageserver_1.CompletionItemKind.Function
        });
    });
    return completionItems;
});
connection.onCompletionResolve((item) => {
    if (item.data) {
        item.detail = item.data.uri;
        item.documentation = `${item.label} details`;
    }
    return item;
});
connection.onHover((textDocumentPosition) => {
    return {
        contents: 'Hello World'
    };
});
connection.listen();
//# sourceMappingURL=server.js.map