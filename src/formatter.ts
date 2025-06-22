import * as vscode from 'vscode';

export class BrowserQLFormatter implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.TextEdit[] {
        const edits: vscode.TextEdit[] = [];
        const text = document.getText();
        const lines = text.split('\n');
        let indentLevel = 0;
        let inFunction = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            let newLine = '';

            // Handle indentation
            if (line.endsWith('{') || line.endsWith('(')) {
                newLine = ' '.repeat(indentLevel * 4) + line;
                indentLevel++;
            } else if (line.startsWith('}') || line.startsWith(')')) {
                indentLevel--;
                newLine = ' '.repeat(indentLevel * 4) + line;
            } else {
                newLine = ' '.repeat(indentLevel * 4) + line;
            }

            // Format function parameters
            if (line.includes('(') && !line.includes(')')) {
                inFunction = true;
            } else if (line.includes(')') && inFunction) {
                inFunction = false;
            }

            if (inFunction && line.includes(':')) {
                // Ensure parameters are on new lines
                const params = line.split(',').map(p => p.trim());
                if (params.length > 1) {
                    newLine = params.map((param, index) => {
                        if (index === 0) {
                            return ' '.repeat(indentLevel * 4) + param;
                        }
                        return ' '.repeat(indentLevel * 4) + '    ' + param;
                    }).join(',\n');
                }
            }

            // Add the formatted line
            if (newLine !== lines[i]) {
                const range = new vscode.Range(
                    new vscode.Position(i, 0),
                    new vscode.Position(i, lines[i].length)
                );
                edits.push(vscode.TextEdit.replace(range, newLine));
            }
        }

        return edits;
    }
} 