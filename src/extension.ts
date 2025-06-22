import * as vscode from 'vscode';
import { browserQLOperations, browserQLKeywords, browserQLWaitUntilOptions } from './browserql-schema';
import { BrowserQLFormatter } from './formatter';
import { BrowserQLCompletionProvider } from './completion-provider';
import { BrowserQLHoverProvider } from './hover-provider';

export function activate(context: vscode.ExtensionContext) {
    console.log('BrowserQL extension is now active!');

    const documentSelector = { scheme: 'file', language: 'browserql' };

    // Register completion provider
    const completionProvider = new BrowserQLCompletionProvider();
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            documentSelector,
            completionProvider,
            ' ', // Trigger on space
            '(',  // Trigger on opening parenthesis
            '{',  // Trigger on opening brace
            ':'   // Trigger on colon
        )
    );

    // Register hover provider
    const hoverProvider = new BrowserQLHoverProvider();
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            documentSelector,
            hoverProvider
        )
    );

    // Register formatter
    const formatter = vscode.languages.registerDocumentFormattingEditProvider(
        'browserql',
        new BrowserQLFormatter()
    );
    context.subscriptions.push(formatter);

    // Register definition provider for operations
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            documentSelector,
            {
                provideDefinition(document, position, token) {
                    const wordRange = document.getWordRangeAtPosition(position);
                    if (!wordRange) {
                        return null;
                    }

                    const word = document.getText(wordRange);
                    const operation = browserQLOperations.find(op => op.name === word);
                    
                    if (operation) {
                        // For demo purposes, show definition as the operation description
                        // In a real implementation, this would navigate to actual schema definitions
                        return null; // Would return Location objects for actual definitions
                    }
                    return null;
                }
            }
        )
    );

    // Register document symbol provider
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            documentSelector,
            {
                provideDocumentSymbols(document, token) {
                    const symbols: vscode.DocumentSymbol[] = [];
                    const text = document.getText();
                    const lines = text.split('\n');

                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        
                        // Find mutation/query blocks
                        const blockMatch = line.match(/^\s*(mutation|query)\s+(\w+)\s*\{/);
                        if (blockMatch) {
                            const range = new vscode.Range(i, 0, i, line.length);
                            const symbol = new vscode.DocumentSymbol(
                                blockMatch[2], // name
                                blockMatch[1], // detail
                                blockMatch[1] === 'mutation' ? vscode.SymbolKind.Method : vscode.SymbolKind.Function,
                                range,
                                range
                            );
                            symbols.push(symbol);
                        }

                        // Find operations
                        const operationMatch = line.match(/^\s*(\w+)\s*\(/);
                        if (operationMatch && browserQLOperations.find(op => op.name === operationMatch[1])) {
                            const range = new vscode.Range(i, 0, i, line.length);
                            const symbol = new vscode.DocumentSymbol(
                                operationMatch[1],
                                'BrowserQL Operation',
                                vscode.SymbolKind.Method,
                                range,
                                range
                            );
                            symbols.push(symbol);
                        }
                    }

                    return symbols;
                }
            }
        )
    );

    // Register folding range provider
    context.subscriptions.push(
        vscode.languages.registerFoldingRangeProvider(
            documentSelector,
            {
                provideFoldingRanges(document, context, token) {
                    const ranges: vscode.FoldingRange[] = [];
                    const text = document.getText();
                    const lines = text.split('\n');
                    const bracketStack: { line: number, char: string }[] = [];

                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        for (let j = 0; j < line.length; j++) {
                            const char = line[j];
                            if (char === '{') {
                                bracketStack.push({ line: i, char });
                            } else if (char === '}' && bracketStack.length > 0) {
                                const start = bracketStack.pop();
                                if (start && i > start.line) {
                                    ranges.push(new vscode.FoldingRange(start.line, i, vscode.FoldingRangeKind.Region));
                                }
                            }
                        }
                    }

                    return ranges;
                }
            }
        )
    );
}

export function deactivate() {} 