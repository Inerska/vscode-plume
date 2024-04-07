'use strict';

import {
    createConnection, IConnection,
    TextDocuments, 
    InitializeResult,
	TextDocumentsConfiguration,
	TextDocumentContentChangeEvent,
	CompletionItem,
	CompletionItemKind,
	TextDocumentSyncKind,
	ProposedFeatures,
	TextDocumentPositionParams
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

let connection: IConnection = createConnection(ProposedFeatures.all);

let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

documents.listen(connection);


let workspaceRoot: string;
connection.onInitialize((params): InitializeResult => {
    let workspaceRoot = params.workspaceFolders;
    return {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
			completionProvider: {
				resolveProvider: true
			},
			hoverProvider: true
        }
    }
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
    const completionItems: CompletionItem[] = [];
    const uri = textDocumentPosition.textDocument.uri;

    keywords.forEach(keyword => {
        completionItems.push({
            label: keyword,
            kind: CompletionItemKind.Keyword,
            data: { uri }
        });
    });

    types.forEach(type => {
        completionItems.push({
            label: type,
            kind: CompletionItemKind.Class
        });
    });

    functions.forEach(func => {
        completionItems.push({
            label: func,
            kind: CompletionItemKind.Function
        });
    });

    return completionItems;
});

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
    if (item.data) {
		item.detail = item.data.uri;
		item.documentation = `${item.label} details`;
	}

	return item;
});

	
connection.onHover((textDocumentPosition: TextDocumentPositionParams) => {
	return {
		contents: 'Hello World'
	};
});

connection.listen();