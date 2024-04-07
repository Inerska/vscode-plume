import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';
import { createCompletionItems } from '../utils/createCompletionItems';

export const completionItems: CompletionItem[] = [
    ...createCompletionItems('keyword', ['type', 'extend', 'with', 'return', 'switch', 'case', 'require', 'map', 'and_then', 'pure', 'satisfy', 'character', 'string', 'infixr', 'operator']),
    ...createCompletionItems('class', ['user', 'str', 'int', 'ParserResult', 'Parser', 'Option', 'char', 'Result', 'Ok', 'Error']),
    ...createCompletionItems('function', ['to_str', 'facto', 'eval_parser', 'extract_head', 'run_parser', 'throwParser', 'throw_result', 'println']),
];