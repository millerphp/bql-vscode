import * as vscode from 'vscode';
import { 
    browserQLOperations, 
    browserQLDirectives,
    browserQLKeywords, 
    browserQLWaitUntilOptions, 
    browserQLWaitUntilHistoryOptions,
    browserQLWaitUntilGotoOptions,
    browserQLLiveURLStreamTypeOptions,
    browserQLPDFPageFormatOptions,
    browserQLCountryTypeOptions,
    browserQLMethodOptions,
    browserQLOperatorTypesOptions,
    browserQLResourceTypeOptions,
    BrowserQLOperation, 
    BrowserQLDirective,
    BrowserQLReturn 
} from './browserql-schema';

/**
 * Provides code completion for BrowserQL operations, keywords, and arguments
 */
export class BrowserQLCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        const items: vscode.CompletionItem[] = [];

        // Provide keyword completions
        if (linePrefix.trim().length === 0 || linePrefix.endsWith(' ')) {
            browserQLKeywords.forEach(keyword => {
                const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
                item.documentation = new vscode.MarkdownString(`BrowserQL keyword: ${keyword}`);
                items.push(item);
            });
        }

        // Provide operation completions
        if (linePrefix.includes('{') && !linePrefix.includes(':')) {
            browserQLOperations.forEach(operation => {
                const item = new vscode.CompletionItem(operation.name, vscode.CompletionItemKind.Function);
                const docUrl = `https://docs.browserless.io/bql-schema/operations/mutations/${operation.name}`;
                const docMarkdown = new vscode.MarkdownString(`
                    ${operation.description}
                    
                    📖 [View Documentation](${docUrl})
                    
                    **Arguments:**
                    ${operation.arguments.map(arg => 
                        `- ${arg.name}: ${arg.type}${arg.required ? ' (required)' : ''} - ${arg.description}`
                    ).join('\n')}
                    
                    **Returns:**
                    ${operation.returns.map(ret => 
                        `- ${ret.name}: ${ret.type} - ${ret.description}`
                    ).join('\n')}
                `);
                docMarkdown.isTrusted = true; // Allow command links
                item.documentation = docMarkdown;
                items.push(item);
            });
        }

        // Provide argument completions
        if (linePrefix.includes('(')) {
            const currentOperation = browserQLOperations.find(op => 
                linePrefix.includes(`${op.name}(`)
            );
            
            if (currentOperation) {
                currentOperation.arguments.forEach(arg => {
                    const item = new vscode.CompletionItem(arg.name, vscode.CompletionItemKind.Property);
                    item.documentation = new vscode.MarkdownString(`
                        ${arg.description}
                        Type: ${arg.type}
                        ${arg.required ? 'Required' : 'Optional'}
                    `);
                    items.push(item);
                });
            }
        }

        // Provide waitUntil options based on operation type
        if (linePrefix.includes('waitUntil:')) {
            const currentOperation = browserQLOperations.find(op => 
                linePrefix.includes(`${op.name}(`)
            );
            
            let waitUntilOptions: string[] = browserQLWaitUntilOptions;
            
            if (currentOperation) {
                // Use specific enum based on operation type
                const waitUntilArg = currentOperation.arguments.find(arg => arg.name === 'waitUntil');
                if (waitUntilArg?.type === 'WaitUntilHistory') {
                    waitUntilOptions = browserQLWaitUntilHistoryOptions;
                } else if (waitUntilArg?.type === 'WaitUntilGoto') {
                    waitUntilOptions = browserQLWaitUntilGotoOptions;
                }
            }
            
            waitUntilOptions.forEach(option => {
                const item = new vscode.CompletionItem(option, vscode.CompletionItemKind.Value);
                item.documentation = new vscode.MarkdownString(`Wait until ${option} event fires`);
                items.push(item);
            });
        }

        // Provide return field completions
        if (this.isInsideReturnBlock(document, position)) {
            const currentOperation = this.findCurrentOperation(document, position);
            if (currentOperation) {
                currentOperation.returns.forEach((ret: BrowserQLReturn) => {
                    const item = new vscode.CompletionItem(ret.name, vscode.CompletionItemKind.Field);
                    item.documentation = new vscode.MarkdownString(`
                        ${ret.description}
                        Type: ${ret.type}
                    `);
                    items.push(item);
                });
            }
        }
        
        // Provide StandardCookie field completions when inside cookies field
        if (this.isInsideCookiesField(document, position)) {
            const cookieFields = ['name', 'value', 'url', 'domain', 'path', 'secure', 'httpOnly', 'sameSite', 'expires'];
            cookieFields.forEach(field => {
                const item = new vscode.CompletionItem(field, vscode.CompletionItemKind.Field);
                let description = '';
                let type = 'String';
                
                switch (field) {
                    case 'name': description = 'The cookie\'s name'; type = 'String!'; break;
                    case 'value': description = 'The cookie\'s value'; type = 'String!'; break;
                    case 'url': description = 'The request-URI to associate with the cookie'; break;
                    case 'domain': description = 'The domain associated with the cookie'; break;
                    case 'path': description = 'The path associated with the cookie'; break;
                    case 'secure': description = 'Indicates if the cookie is secure'; type = 'Boolean'; break;
                    case 'httpOnly': description = 'Indicates if the cookie is HTTP-only'; type = 'Boolean'; break;
                    case 'sameSite': description = 'Specifies the SameSite policy for the cookie'; type = 'CookieSameSite'; break;
                    case 'expires': description = 'The expiration date of the cookie as a timestamp'; type = 'Float'; break;
                }
                
                item.documentation = new vscode.MarkdownString(`
                    ${description}
                    Type: ${type}
                `);
                items.push(item);
            });
        }
        
        // Provide CookieSameSite enum completions
        if (linePrefix.includes('sameSite:')) {
            const sameSiteValues = ['Strict', 'Lax', 'None'];
            sameSiteValues.forEach(value => {
                const item = new vscode.CompletionItem(value, vscode.CompletionItemKind.EnumMember);
                item.documentation = new vscode.MarkdownString(`${value} SameSite policy`);
                items.push(item);
            });
        }

        // Provide LiveURLStreamType enum completions
        if (linePrefix.includes('type:') && linePrefix.includes('liveURL(')) {
            browserQLLiveURLStreamTypeOptions.forEach(streamType => {
                const item = new vscode.CompletionItem(streamType, vscode.CompletionItemKind.EnumMember);
                let description = '';
                switch (streamType) {
                    case 'jpeg':
                        description = 'JPEG format - Lower bandwidth, useful for low bandwidth networks. Supports quality settings.';
                        break;
                    case 'png':
                        description = 'PNG format - Higher quality but consumes considerably more bandwidth.';
                        break;
                }
                item.documentation = new vscode.MarkdownString(description);
                items.push(item);
            });
        }

        // Provide PDFPageFormat enum completions
        if (linePrefix.includes('format:') && linePrefix.includes('pdf(')) {
            browserQLPDFPageFormatOptions.forEach(pageFormat => {
                const item = new vscode.CompletionItem(pageFormat, vscode.CompletionItemKind.EnumMember);
                let description = '';
                switch (pageFormat) {
                    case 'letter':
                        description = 'Letter size: 8.5" × 11" (216 × 279 mm)';
                        break;
                    case 'legal':
                        description = 'Legal size: 8.5" × 14" (216 × 356 mm)';
                        break;
                    case 'tabloid':
                        description = 'Tabloid size: 11" × 17" (279 × 432 mm)';
                        break;
                    case 'ledger':
                        description = 'Ledger size: 17" × 11" (432 × 279 mm)';
                        break;
                    case 'a0':
                        description = 'ISO A0: 841 × 1189 mm (33.1" × 46.8")';
                        break;
                    case 'a1':
                        description = 'ISO A1: 594 × 841 mm (23.4" × 33.1")';
                        break;
                    case 'a2':
                        description = 'ISO A2: 420 × 594 mm (16.5" × 23.4")';
                        break;
                    case 'a3':
                        description = 'ISO A3: 297 × 420 mm (11.7" × 16.5")';
                        break;
                    case 'a4':
                        description = 'ISO A4: 210 × 297 mm (8.3" × 11.7") - Most common';
                        break;
                    case 'a5':
                        description = 'ISO A5: 148 × 210 mm (5.8" × 8.3")';
                        break;
                    case 'a6':
                        description = 'ISO A6: 105 × 148 mm (4.1" × 5.8")';
                        break;
                }
                item.documentation = new vscode.MarkdownString(description);
                items.push(item);
            });
        }

        // Provide CountryType enum completions for proxy operation
        if (linePrefix.includes('country:') && linePrefix.includes('proxy(')) {
            browserQLCountryTypeOptions.forEach(country => {
                const item = new vscode.CompletionItem(country, vscode.CompletionItemKind.EnumMember);
                item.documentation = new vscode.MarkdownString(`Country code: ${country}`);
                items.push(item);
            });
        }

        // Provide Method enum completions for proxy operation
        if (linePrefix.includes('method:') && linePrefix.includes('proxy(')) {
            browserQLMethodOptions.forEach(method => {
                const item = new vscode.CompletionItem(method, vscode.CompletionItemKind.EnumMember);
                let description = '';
                switch (method) {
                    case 'GET':
                        description = 'HTTP GET method - retrieve data';
                        break;
                    case 'POST':
                        description = 'HTTP POST method - send data';
                        break;
                    case 'PUT':
                        description = 'HTTP PUT method - update/replace data';
                        break;
                    case 'DELETE':
                        description = 'HTTP DELETE method - remove data';
                        break;
                    case 'PATCH':
                        description = 'HTTP PATCH method - partial update';
                        break;
                    case 'HEAD':
                        description = 'HTTP HEAD method - headers only';
                        break;
                    case 'OPTIONS':
                        description = 'HTTP OPTIONS method - preflight requests';
                        break;
                }
                item.documentation = new vscode.MarkdownString(description);
                items.push(item);
            });
        }

        // Provide OperatorTypes enum completions for proxy operation
        if (linePrefix.includes('operator:') && linePrefix.includes('proxy(')) {
            browserQLOperatorTypesOptions.forEach(operator => {
                const item = new vscode.CompletionItem(operator, vscode.CompletionItemKind.EnumMember);
                let description = '';
                switch (operator) {
                    case 'or':
                        description = 'OR logic - any condition matches will be proxied';
                        break;
                    case 'and':
                        description = 'AND logic - all conditions must match to be proxied';
                        break;
                }
                item.documentation = new vscode.MarkdownString(description);
                items.push(item);
            });
        }

        // Provide ResourceType enum completions for proxy operation
        if (linePrefix.includes('type:') && linePrefix.includes('proxy(')) {
            browserQLResourceTypeOptions.forEach(resourceType => {
                const item = new vscode.CompletionItem(resourceType, vscode.CompletionItemKind.EnumMember);
                let description = '';
                switch (resourceType) {
                    case 'document':
                        description = 'HTML documents and main page requests';
                        break;
                    case 'stylesheet':
                        description = 'CSS stylesheets';
                        break;
                    case 'image':
                        description = 'Images (PNG, JPEG, GIF, SVG, etc.)';
                        break;
                    case 'media':
                        description = 'Audio and video files';
                        break;
                    case 'font':
                        description = 'Web fonts (WOFF, WOFF2, TTF, etc.)';
                        break;
                    case 'script':
                        description = 'JavaScript files';
                        break;
                    case 'texttrack':
                        description = 'Text track files (subtitles, captions)';
                        break;
                    case 'xhr':
                        description = 'XMLHttpRequest AJAX calls';
                        break;
                    case 'fetch':
                        description = 'Fetch API requests';
                        break;
                    case 'eventsource':
                        description = 'Server-sent events';
                        break;
                    case 'websocket':
                        description = 'WebSocket connections';
                        break;
                    case 'manifest':
                        description = 'Web app manifest files';
                        break;
                    case 'other':
                        description = 'Other resource types';
                        break;
                }
                item.documentation = new vscode.MarkdownString(description);
                items.push(item);
            });
        }

        // Provide directive completions
        if (linePrefix.includes('@') || linePrefix.endsWith(' @')) {
            browserQLDirectives.forEach(directive => {
                const item = new vscode.CompletionItem(`@${directive.name}`, vscode.CompletionItemKind.Function);
                const docUrl = `https://docs.browserless.io/bql-schema/operations/directives/${directive.name}`;
                const docMarkdown = new vscode.MarkdownString(`
                    ${directive.description}
                    
                    📖 [View Documentation](${docUrl})
                    
                    **Arguments:**
                    ${directive.arguments.map(arg => 
                        `- ${arg.name}: ${arg.type}${arg.required ? ' (required)' : ''} - ${arg.description}`
                    ).join('\n')}
                    
                    **Usage Locations:**
                    ${directive.locations.join(', ')}
                `);
                docMarkdown.isTrusted = true;
                item.documentation = docMarkdown;
                item.insertText = new vscode.SnippetString(`@${directive.name}(${directive.arguments.map(arg => `${arg.name}: \${${arg.name}}`).join(', ')})`);
                items.push(item);
            });
        }

        // Provide directive argument completions
        if (linePrefix.includes('@')) {
            const directiveMatch = linePrefix.match(/@(\w+)\s*\(/);
            if (directiveMatch) {
                const directiveName = directiveMatch[1];
                const directive = browserQLDirectives.find(d => d.name === directiveName);
                if (directive) {
                    directive.arguments.forEach(arg => {
                        const item = new vscode.CompletionItem(arg.name, vscode.CompletionItemKind.Property);
                        item.documentation = new vscode.MarkdownString(`
                            ${arg.description}
                            Type: ${arg.type}
                            ${arg.required ? 'Required' : 'Optional'}
                        `);
                        items.push(item);
                    });
                }
            }
        }

        return items;
    }

    private isInsideReturnBlock(document: vscode.TextDocument, position: vscode.Position): boolean {
        const line = document.lineAt(position.line).text;
        const textBeforeCursor = line.substring(0, position.character);
        
        // Check if we're inside curly braces
        if (!textBeforeCursor.includes('{')) {
            return false;
        }

        // Find the opening brace of the current block
        let braceCount = 0;
        for (let i = position.line; i >= 0; i--) {
            const currentLine = document.lineAt(i).text;
            const lineBeforeCursor = i === position.line ? textBeforeCursor : currentLine;
            
            // Count braces in reverse
            for (let j = lineBeforeCursor.length - 1; j >= 0; j--) {
                if (currentLine[j] === '}') {
                    braceCount--;
                }
                if (currentLine[j] === '{') {
                    braceCount++;
                }
            }

            // If we found the opening brace of our block
            if (braceCount > 0) {
                // Check if this is a return block (after an operation)
                const operationMatch = currentLine.match(/(\w+)\s*\(/);
                return !!operationMatch;
            }
        }

        return false;
    }

    private findCurrentOperation(document: vscode.TextDocument, position: vscode.Position): BrowserQLOperation | undefined {
        // Find the operation line by scanning up until we find a line with parentheses
        for (let i = position.line; i >= 0; i--) {
            const line = document.lineAt(i).text;
            const operationMatch = line.match(/(\w+)\s*\(/);
            if (operationMatch) {
                const operationName = operationMatch[1];
                return browserQLOperations.find(op => op.name === operationName);
            }
        }
        return undefined;
    }

    private isInsideCookiesField(document: vscode.TextDocument, position: vscode.Position): boolean {
        // Check if we're inside a cookies field block
        const lineText = document.lineAt(position.line).text;
        const textBeforeCursor = lineText.substring(0, position.character);
        
        // If we're clearly inside a cookies block, check for nested structure
        if (textBeforeCursor.includes('cookies') && textBeforeCursor.includes('{')) {
            // Scan backwards to find the cookies field declaration
            for (let i = position.line; i >= 0; i--) {
                const line = document.lineAt(i).text;
                if (line.includes('cookies') && line.includes('{')) {
                    return true;
                }
            }
        }
        
        return false;
    }
} 