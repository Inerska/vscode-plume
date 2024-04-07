import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';
import { CompletionData } from '../completion/completionData';

export function createCompletionItems(kind: 'keyword' | 'class' | 'function', labels: string[]): CompletionItem[] {
    return labels.map((label) => ({
        label,
        kind: kind === 'keyword'
            ? CompletionItemKind.Keyword : kind === 'class'
                ? CompletionItemKind.Class : CompletionItemKind.Function,
        data: { uri: '' } as CompletionData,
    }));
}