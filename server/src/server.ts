import {
    createConnection,
    TextDocuments,
    InitializeResult,
    TextDocumentSyncKind,
    ProposedFeatures,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { onCompletion, onCompletionResolve } from './completion/completionProvider';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

documents.listen(connection);

connection.onInitialize((): InitializeResult => ({
    capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        completionProvider: {
            resolveProvider: true,
        },
    },
}));

connection.onCompletion(onCompletion);
connection.onCompletionResolve(onCompletionResolve);

connection.listen();