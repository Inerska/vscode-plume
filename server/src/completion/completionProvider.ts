import { CompletionItem, CompletionItemKind, TextDocument, TextDocumentPositionParams } from 'vscode-languageserver';
import { CompletionData } from './completionData';
import parseLanguageAsync from '../utils/parseLanguage';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function onCompletion(textDocumentPosition: TextDocumentPositionParams): Promise<CompletionItem[]> {
    const plumePath = process.env.PLUME_PATH;

    if (!plumePath) {
        throw new Error("PLUME_PATH environment variable is not set");
    }

    const completionItems = await Promise.all([
        parseDirectoryPlumeFiles(plumePath),
        parseDirectoryPlumeFiles(join(plumePath, "datatypes")),
        parseDirectoryPlumeFiles(process.cwd())
    ]);

    const context = getCompletionContext(textDocumentPosition, TextDocument.create("uri", "plume", 1, ""));
    const filteredCompletionItems = filterCompletionItems(completionItems.flat(), context);

    return Array.from(new Set(filteredCompletionItems));
}

export function onCompletionResolve(item: CompletionItem): CompletionItem {
    const data = item.data as CompletionData;
    if (data) {
        item.detail = data.uri;
        item.documentation = `${item.label} details`;
    }
    return item;
}

async function parseDirectoryPlumeFiles(directoryPath: string): Promise<CompletionItem[]> {
    const files = await readdir(directoryPath);
    const completionItems: CompletionItem[] = [];

    await Promise.all(files.map(async (file) => {
        if (!file.endsWith(".plm")) {
            return;
        }

        const uri = join(directoryPath, file);
        const languageElements = await parseLanguageAsync(uri);

        const createCompletionItem = (label: string, kind: CompletionItemKind) => ({
            label,
            kind,
            data: { uri }
        });

        completionItems.push(
            ...languageElements.keywords.map((keyword) => createCompletionItem(keyword, CompletionItemKind.Keyword)),
            ...languageElements.types.map((className) => createCompletionItem(className, CompletionItemKind.Class)),
            ...languageElements.functions.map((functionName) => createCompletionItem(functionName, CompletionItemKind.Function)),
            ...languageElements.annotations.map((annotation) => createCompletionItem(annotation, CompletionItemKind.Event)),
            ...languageElements.methods.map((method) => createCompletionItem(method, CompletionItemKind.Method)),
            ...languageElements.userTypes.map((userType) => createCompletionItem(userType, CompletionItemKind.TypeParameter)),
            ...languageElements.macros.map((macro) => createCompletionItem(macro, CompletionItemKind.Snippet))
        );
    }));

    return completionItems;
}

function getCompletionContext(textDocumentPosition: TextDocumentPositionParams, document: TextDocument): CompletionContext {
    const { position } = textDocumentPosition;
    const text = document.getText();
    const lines = text.split('\n');
    const currentLine = lines[position.line];

    if (!currentLine) {
        return CompletionContext.Default;
    }

    const currentLineBeforeCursor = currentLine.substring(0, position?.character);

    if (currentLineBeforeCursor.trim().endsWith('.')) {
        return CompletionContext.MemberAccess;
    } else if (currentLineBeforeCursor.trim().endsWith('(')) {
        return CompletionContext.FunctionArgument;
    } else if (currentLineBeforeCursor.trim().endsWith(':')) {
        return CompletionContext.TypeAnnotation;
    } else {
        return CompletionContext.Default;
    }
}

function filterCompletionItems(completionItems: CompletionItem[], context: CompletionContext): CompletionItem[] {
    switch (context) {
        case CompletionContext.MemberAccess:
            return completionItems.filter(item => item.kind === CompletionItemKind.Method || item.kind === CompletionItemKind.Property);
        case CompletionContext.FunctionArgument:
            return completionItems.filter(item => item.kind === CompletionItemKind.Variable || item.kind === CompletionItemKind.Function);
        case CompletionContext.TypeAnnotation:
            return completionItems.filter(item => item.kind === CompletionItemKind.Class || item.kind === CompletionItemKind.Interface || item.kind === CompletionItemKind.TypeParameter);
        default:
            return completionItems;
    }
}

enum CompletionContext {
    Default,
    MemberAccess,
    FunctionArgument,
    TypeAnnotation
}