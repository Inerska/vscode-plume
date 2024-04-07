import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';

interface LanguageElements {
    keywords: string[];
    types: string[];
    functions: string[];
    annotations: string[];
    methods: string[];
    operators: string[];
    numbers: string[];
    userTypes: string[];
    macros: string[];
}

export default async function parseLanguageAsync(uri: string): Promise<LanguageElements> {
    const fileContent = await readFile(uri, 'utf-8');
    const languageElements: LanguageElements = {
        keywords: [],
        types: [],
        functions: [],
        annotations: [],
        methods: [],
        operators: [],
        numbers: [],
        userTypes: [],
        macros: []
    };

    const keywordRegex = /\b(if|then|else|switch|case|return|type|extend|with|infixr|require|source)\b/g;
    let match;
    while ((match = keywordRegex.exec(fileContent)) !== null) {
        languageElements.keywords.push(match[0]);
    }

    const typeRegex = /:\s*\b([A-Za-z_][A-Za-z0-9_<>]*)\b/g;
    while ((match = typeRegex.exec(fileContent)) !== null) {
        languageElements.types.push(match[1]);
    }

    const functionRegex = /\b(\w+)(?:\s*<[^>]+>)?\s*\(/g;
    while ((match = functionRegex.exec(fileContent)) !== null) {
        languageElements.functions.push(match[1]);
    }

    const annotationRegex = /@\w+/g;
    while ((match = annotationRegex.exec(fileContent)) !== null) {
        languageElements.annotations.push(match[0]);
    }

    const methodRegex = /\.(\w+)\b/g;
    while ((match = methodRegex.exec(fileContent)) !== null) {
        languageElements.methods.push(match[1]);
    }

    const operatorRegex = /(\+|\-|\*|\/|\=\=|\=|\<\=|\>\=|\<|\>|\.\.|\[|\]|\(|\)|\:|\?|\,|\>\>)/g;
    while ((match = operatorRegex.exec(fileContent)) !== null) {
        languageElements.operators.push(match[0]);
    }

    const numberRegex = /\b\d+\b/g;
    while ((match = numberRegex.exec(fileContent)) !== null) {
        languageElements.numbers.push(match[0]);
    }

    const userTypeRegex = /\b(user|ParserResult|Parser)\b/g;
    while ((match = userTypeRegex.exec(fileContent)) !== null) {
        languageElements.userTypes.push(match[0]);
    }

    const macroRegex = /\b([A-Za-z]+)\(.*\)\b/g;
    while ((match = macroRegex.exec(fileContent)) !== null) {
        languageElements.macros.push(match[1]);
    }

    return languageElements;
}