import { CompletionItem, TextDocumentPositionParams } from 'vscode-languageserver';
import { CompletionData } from './completionData';
import { completionItems } from './completionItems';

export function onCompletion(textDocumentPosition: TextDocumentPositionParams): CompletionItem[] {
    const uri = textDocumentPosition.textDocument.uri;
    completionItems.forEach((item) => {
        (item.data as CompletionData).uri = uri;
    });
    return completionItems;
}

export function onCompletionResolve(item: CompletionItem): CompletionItem {
    const data = item.data as CompletionData;
    if (data) {
        item.detail = data.uri;
        item.documentation = `${item.label} details`;
    }
    return item;
}