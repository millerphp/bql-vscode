import * as vscode from 'vscode';
import { browserQLOperations, browserQLDirectives } from './browserql-schema';

/**
 * Helper functions to generate BrowserQL documentation URLs
 */
const BROWSERQL_DOCS_BASE = 'https://docs.browserless.io/bql-schema';

function getOperationDocUrl(operationName: string): string {
    return `${BROWSERQL_DOCS_BASE}/operations/mutations/${operationName}`;
}

function getDirectiveDocUrl(directiveName: string): string {
    return `${BROWSERQL_DOCS_BASE}/operations/directives/${directiveName}`;
}

function getTypeDocUrl(typeName: string): string {
    const cleanType = typeName.replace(/[!\[\]]/g, '').toLowerCase();
    
            // Map common types to their documentation paths
        const typeMapping: { [key: string]: string } = {
            // Objects
            'httpresponse': 'types/objects/httpresponse',
            'clickresponse': 'types/objects/clickresponse',
            'cookieresponse': 'types/objects/cookieresponse',
            'textresponse': 'types/objects/textresponse',
            'screenshotresponse': 'types/objects/screenshotresponse',
            'evaluateresponse': 'types/objects/evaluateresponse',
            'typeresponse': 'types/objects/typeresponse',
            'hoverresponse': 'types/objects/hoverresponse',
            'scrollresponse': 'types/objects/scrollresponse',
            'selectresponse': 'types/objects/selectresponse',
        'httpheadersresponse': 'types/objects/httpheadersresponse',
        'captcharesponse': 'types/objects/captcharesponse',
        'titleresponse': 'types/objects/titleresponse',
        'urlresponse': 'types/objects/urlresponse',
        'useragentresponse': 'types/objects/useragentresponse',
                    'standardcookie': 'types/objects/standardcookie',
        'htmlresponse': 'types/objects/htmlresponse',
        'mutation': 'types/objects/mutation',
        'javascriptresponse': 'types/objects/javascriptresponse',
        'liveurlresponse': 'types/objects/liveurlresponse',
        'liveurlstreamtype': 'types/enums/liveurlstreamtype',
        'mapselectorresponse': 'types/objects/mapselectorresponse',
        'attribute': 'types/objects/attribute',
        'pdfresponse': 'types/objects/pdfresponse',
        'defaultresponse': 'responses',
        'proxyresponse': 'types/objects/proxyresponse',
        'countrytype': 'types/enums/countrytype',
        'method': 'types/enums/method',
        'operatortypes': 'types/enums/operatortypes',
        'resourcetype': 'types/enums/resourcetype',
        'queryselectorresponse': 'types/objects/queryselectorresponse',
    'reconnectionresponse': 'types/objects/reconnectionresponse',
    'rejectresponse': 'types/objects/rejectresponse',
    'requestresponse': 'types/objects/requestresponse',
    'responseresponse': 'types/objects/responseresponse',
            
            // Input Types
            'cookieinput': 'schemas',
            'cleaninput': 'schemas',
            'requestinput': 'types/inputs/requestinput',
            'responseinput': 'types/inputs/responseinput',
        
        // Enums
        'waituntilhistory': 'types/enums/wait-until-history',
        'waituntilgoto': 'types/enums/wait-until-goto',
        'cookiesamesite': 'schemas',
        'screenshottype': 'types/enums/screenshottype',
        'pdfpageformat': 'types/enums/pdfpageformat',
        
        // Scalars
        'int': 'types/scalars',
        'float': 'types/scalars', 
        'string': 'types/scalars',
        'boolean': 'types/scalars',
        'any': 'types/scalars'
    };
    
    const path = typeMapping[cleanType];
    if (path) {
        return `${BROWSERQL_DOCS_BASE}/${path}`;
    }
    
    // Default fallback - try to infer the type category
    const kebabCase = cleanType.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return `${BROWSERQL_DOCS_BASE}/types/objects/${kebabCase}`;
}

export class BrowserQLHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return null;
        }

        const word = document.getText(range);
        const line = document.lineAt(position.line).text;
        
        // Check if we're hovering over a directive name
        if (word.startsWith('@') || line.includes(`@${word}`)) {
            const directiveName = word.startsWith('@') ? word.substring(1) : word;
            const directive = browserQLDirectives.find(d => d.name === directiveName);
            if (directive) {
                const markdown = new vscode.MarkdownString();
                markdown.isTrusted = true;
                
                markdown.appendMarkdown(`### @${directive.name}\n\n`);
                markdown.appendMarkdown(`${directive.description}\n\n`);
                markdown.appendMarkdown(`📖 [View Documentation](${getDirectiveDocUrl(directive.name)})\n\n`);
                
                // Add arguments
                if (directive.arguments.length > 0) {
                    markdown.appendMarkdown('#### Arguments\n\n');
                    directive.arguments.forEach(arg => {
                        const required = arg.required ? '**Required**' : 'Optional';
                        const typeWithLink = arg.type.includes('!') 
                            ? `[${arg.type.replace('!', '')}](${getTypeDocUrl(arg.type.replace('!', ''))})!`
                            : `[${arg.type}](${getTypeDocUrl(arg.type)})`;
                        markdown.appendMarkdown(`- \`${arg.name}\`: ${typeWithLink} - ${required}\n`);
                        markdown.appendMarkdown(`  ${arg.description}\n\n`);
                    });
                }
                
                // Add usage locations
                markdown.appendMarkdown('#### Usage Locations\n\n');
                markdown.appendMarkdown(`${directive.locations.join(', ')}\n\n`);
                
                // Add example if available
                if (directive.example) {
                    markdown.appendMarkdown('#### Example\n\n');
                    markdown.appendCodeblock(directive.example, 'graphql');
                }
                
                return new vscode.Hover(markdown);
            }
        }
        
        // Check if we're hovering over a mutation name
        const operation = browserQLOperations.find(op => op.name === word);
        if (operation) {
            const markdown = new vscode.MarkdownString();
            markdown.isTrusted = true; // Allow command links
            
            // Add operation description with documentation link
            markdown.appendMarkdown(`### ${operation.name}\n\n`);
            markdown.appendMarkdown(`${operation.description}\n\n`);
            markdown.appendMarkdown(`📖 [View Documentation](${getOperationDocUrl(operation.name)})\n\n`);
            
            // Add arguments
            if (operation.arguments.length > 0) {
                markdown.appendMarkdown('#### Arguments\n\n');
                operation.arguments.forEach(arg => {
                    const required = arg.required ? '**Required**' : 'Optional';
                    const defaultValue = arg.defaultValue ? ` (default: ${arg.defaultValue})` : '';
                    const typeWithLink = arg.type.includes('!') 
                        ? `[${arg.type.replace('!', '')}](${getTypeDocUrl(arg.type.replace('!', ''))})!`
                        : `[${arg.type}](${getTypeDocUrl(arg.type)})`;
                    markdown.appendMarkdown(`- \`${arg.name}\`: ${typeWithLink} - ${required}${defaultValue}\n`);
                    markdown.appendMarkdown(`  ${arg.description}\n\n`);
                });
            }
            
            // Add returns
            if (operation.returns.length > 0) {
                // Determine the response type based on the operation
                const isHttpResponse = ['back', 'content', 'forward', 'goto', 'reload', 'waitForNavigation'].includes(operation.name);
                const isClickResponse = ['checkbox', 'click'].includes(operation.name);
                const isCookieResponse = ['cookies'].includes(operation.name);
                const isEvaluateResponse = ['evaluate'].includes(operation.name);
                const isHoverResponse = ['hover'].includes(operation.name);
                const isHtmlResponse = ['html'].includes(operation.name);
                const isConditionalOperation = ['if', 'ifnot'].includes(operation.name);
                const isJavaScriptResponse = ['javaScriptEnabled'].includes(operation.name);
                const isLiveURLResponse = ['liveURL'].includes(operation.name);
                const isMapSelectorResponse = ['mapSelector'].includes(operation.name);
                const isPDFResponse = ['pdf'].includes(operation.name);
                const isDefaultResponse = ['preferences'].includes(operation.name);
                const isProxyResponse = ['proxy'].includes(operation.name);
                const isQuerySelectorResponse = ['querySelector', 'querySelectorAll'].includes(operation.name);
                const isReconnectionResponse = ['reconnect'].includes(operation.name);
                const isRejectResponse = ['reject'].includes(operation.name);
                const isRequestResponse = ['request'].includes(operation.name);
        const isResponseResponse = ['response'].includes(operation.name);
        const isScreenshotResponse = ['screenshot'].includes(operation.name);
        const isScrollResponse = ['scroll'].includes(operation.name);
        const isSelectResponse = ['select'].includes(operation.name);
        const isHTTPHeadersResponse = ['setExtraHTTPHeaders'].includes(operation.name);
                const isCaptchaResponse = ['solve', 'verify'].includes(operation.name);
                const isTextResponse = ['text'].includes(operation.name);
                const isTitleResponse = ['title'].includes(operation.name);
                const isURLResponse = ['url'].includes(operation.name);
                const isUserAgentResponse = ['userAgent'].includes(operation.name);
                const isWaitForRequestResponse = ['waitForRequest'].includes(operation.name);
                const isWaitForResponseResponse = ['waitForResponse'].includes(operation.name);
                const isWaitForSelectorResponse = ['waitForSelector'].includes(operation.name);
                const isWaitForTimeoutResponse = ['waitForTimeout'].includes(operation.name);
                const isBrowserResponse = ['browser'].includes(operation.name);
                const isVersionResponse = ['version'].includes(operation.name);
                const isTypeResponse = ['type'].includes(operation.name);
                
                if (isConditionalOperation) {
                    markdown.appendMarkdown('#### Returns (Nested Mutation)\n\n');
                    markdown.appendMarkdown(`🔗 [Mutation Object Documentation](${getTypeDocUrl('Mutation')})\n\n`);
                    markdown.appendMarkdown('This operation allows nested mutation operations inside its block.\n\n');
                } else if (isHttpResponse) {
                    markdown.appendMarkdown('#### Returns (HTTPResponse)\n\n');
                    markdown.appendMarkdown(`📋 [HTTPResponse Documentation](${getTypeDocUrl('HTTPResponse')})\n\n`);
                } else if (isClickResponse) {
                    markdown.appendMarkdown('#### Returns (ClickResponse)\n\n');
                    markdown.appendMarkdown(`📋 [ClickResponse Documentation](${getTypeDocUrl('ClickResponse')})\n\n`);
                } else if (isCookieResponse) {
                    markdown.appendMarkdown('#### Returns (CookieResponse)\n\n');
                    markdown.appendMarkdown(`📋 [CookieResponse Documentation](${getTypeDocUrl('CookieResponse')})\n\n`);
                } else if (isEvaluateResponse) {
                    markdown.appendMarkdown('#### Returns (EvaluateResponse)\n\n');
                    markdown.appendMarkdown(`📋 [EvaluateResponse Documentation](${getTypeDocUrl('EvaluateResponse')})\n\n`);
                } else if (isHoverResponse) {
                    markdown.appendMarkdown('#### Returns (HoverResponse)\n\n');
                    markdown.appendMarkdown(`📋 [HoverResponse Documentation](${getTypeDocUrl('HoverResponse')})\n\n`);
                } else if (isHtmlResponse) {
                    markdown.appendMarkdown('#### Returns (HTMLResponse)\n\n');
                    markdown.appendMarkdown(`📋 [HTMLResponse Documentation](${getTypeDocUrl('HTMLResponse')})\n\n`);
                } else if (isJavaScriptResponse) {
                    markdown.appendMarkdown('#### Returns (JavaScriptResponse)\n\n');
                    markdown.appendMarkdown(`📋 [JavaScriptResponse Documentation](${getTypeDocUrl('JavaScriptResponse')})\n\n`);
                } else if (isLiveURLResponse) {
                    markdown.appendMarkdown('#### Returns (LiveURLResponse)\n\n');
                    markdown.appendMarkdown(`📋 [LiveURLResponse Documentation](${getTypeDocUrl('LiveURLResponse')})\n\n`);
                } else if (isMapSelectorResponse) {
                    markdown.appendMarkdown('#### Returns ([MapSelectorResponse])\n\n');
                    markdown.appendMarkdown(`📋 [MapSelectorResponse Documentation](${getTypeDocUrl('MapSelectorResponse')})\n\n`);
                    markdown.appendMarkdown('Returns an array of extracted data from multiple DOM elements. Supports nested mapping for hierarchical data extraction.\n\n');
                } else if (isPDFResponse) {
                    markdown.appendMarkdown('#### Returns (PDFResponse)\n\n');
                    markdown.appendMarkdown(`📋 [PDFResponse Documentation](${getTypeDocUrl('PDFResponse')})\n\n`);
                    markdown.appendMarkdown('Returns PDF document data. The response includes base64-encoded PDF content for download or further processing.\n\n');
                } else if (isDefaultResponse) {
                    markdown.appendMarkdown('#### Returns (DefaultResponse)\n\n');
                    markdown.appendMarkdown(`📋 [DefaultResponse Documentation](${getTypeDocUrl('DefaultResponse')})\n\n`);
                    markdown.appendMarkdown('Returns session configuration data. The response includes the configured default timeout value that will be used for all subsequent operations.\n\n');
                } else if (isProxyResponse) {
                    markdown.appendMarkdown('#### Returns (ProxyResponse)\n\n');
                    markdown.appendMarkdown(`📋 [ProxyResponse Documentation](${getTypeDocUrl('ProxyResponse')})\n\n`);
                    markdown.appendMarkdown('Returns proxy configuration data. The response includes timing information for setting up the proxy patterns that will route matching requests through the specified proxy.\n\n');
                } else if (isQuerySelectorResponse) {
                    markdown.appendMarkdown('#### Returns ([QuerySelectorResponse])\n\n');
                    markdown.appendMarkdown(`📋 [QuerySelectorResponse Documentation](${getTypeDocUrl('QuerySelectorResponse')})\n\n`);
                } else if (isReconnectionResponse) {
                    markdown.appendMarkdown('#### Returns ([ReconnectionResponse])\n\n');
                    markdown.appendMarkdown(`🔌 [ReconnectionResponse Documentation](${getTypeDocUrl('ReconnectionResponse')})\n\n`);
                    markdown.appendMarkdown('Returns reconnection information for maintaining browser session continuity. Includes GraphQL endpoint, WebSocket endpoints, and DevTools URLs for session management.\n\n');
                } else if (isRejectResponse) {
                    markdown.appendMarkdown('#### Returns ([RejectResponse])\n\n');
                    markdown.appendMarkdown(`🚫 [RejectResponse Documentation](${getTypeDocUrl('RejectResponse')})\n\n`);
                    markdown.appendMarkdown('Returns request rejection status and timing information. Shows whether request filtering is enabled and operation performance metrics.\n\n');
                } else if (isRequestResponse) {
                    markdown.appendMarkdown('#### Returns ([RequestResponse])\n\n');
                    markdown.appendMarkdown(`📡 [RequestResponse Documentation](${getTypeDocUrl('RequestResponse')})\n\n`);
                    markdown.appendMarkdown('Returns information about browser network requests with optional filtering by URL patterns, methods, and resource types. Includes request headers and timing data.\n\n');
                } else if (isResponseResponse) {
                    markdown.appendMarkdown('#### Returns ([ResponseResponse])\n\n');
                    markdown.appendMarkdown(`📨 [ResponseResponse Documentation](${getTypeDocUrl('ResponseResponse')})\n\n`);
                    markdown.appendMarkdown('Returns information about browser network responses with optional filtering by URL patterns, methods, status codes, and resource types. Includes response body and headers.\n\n');
                } else if (isScreenshotResponse) {
                    markdown.appendMarkdown('#### Returns (ScreenshotResponse)\n\n');
                    markdown.appendMarkdown(`📸 [ScreenshotResponse Documentation](${getTypeDocUrl('ScreenshotResponse')})\n\n`);
                    markdown.appendMarkdown('Returns screenshot image data with base64 encoding. Supports full page, element-specific, and clipped region captures with format and quality options.\n\n');
                } else if (isScrollResponse) {
                    markdown.appendMarkdown('#### Returns (ScrollResponse)\n\n');
                    markdown.appendMarkdown(`📜 [ScrollResponse Documentation](${getTypeDocUrl('ScrollResponse')})\n\n`);
                    markdown.appendMarkdown('Returns scroll operation data including timing information. Supports element-based and coordinate-based scrolling with wait conditions.\n\n');
                } else if (isSelectResponse) {
                    markdown.appendMarkdown('#### Returns (SelectResponse)\n\n');
                    markdown.appendMarkdown(`🔽 [SelectResponse Documentation](${getTypeDocUrl('SelectResponse')})\n\n`);
                    markdown.appendMarkdown('Returns select operation data including timing information. Supports single and multiple option selection from dropdown elements.\n\n');
                } else if (isHTTPHeadersResponse) {
                    markdown.appendMarkdown('#### Returns (HTTPHeadersResponse)\n\n');
                    markdown.appendMarkdown(`🌐 [HTTPHeadersResponse Documentation](${getTypeDocUrl('HTTPHeadersResponse')})\n\n`);
                    markdown.appendMarkdown('Returns HTTP headers operation data including timing information. Configures custom headers for all subsequent page requests.\n\n');
                } else if (isCaptchaResponse) {
                    markdown.appendMarkdown('#### Returns (CaptchaResponse) 🚨 EXPERIMENTAL\n\n');
                    markdown.appendMarkdown(`🧩 [CaptchaResponse Documentation](${getTypeDocUrl('CaptchaResponse')})\n\n`);
                    markdown.appendMarkdown('**EXPERIMENTAL**: Returns captcha solving status and timing information. Indicates whether a captcha was found and successfully solved.\n\n');
                } else if (isTextResponse) {
                    markdown.appendMarkdown('#### Returns (TextResponse)\n\n');
                    markdown.appendMarkdown(`📝 [TextResponse Documentation](${getTypeDocUrl('TextResponse')})\n\n`);
                    markdown.appendMarkdown('Returns text content from the page or specified selector. Supports cleaning options for LLM processing and text analysis.\n\n');
                } else if (isTitleResponse) {
                    markdown.appendMarkdown('#### Returns (TitleResponse)\n\n');
                    markdown.appendMarkdown(`📄 [TitleResponse Documentation](${getTypeDocUrl('TitleResponse')})\n\n`);
                    markdown.appendMarkdown('Returns the title of the page that the browser is currently at. Simple text extraction for page identification.\n\n');
                } else if (isURLResponse) {
                    markdown.appendMarkdown('#### Returns (URLResponse)\n\n');
                    markdown.appendMarkdown(`🔗 [URLResponse Documentation](${getTypeDocUrl('URLResponse')})\n\n`);
                    markdown.appendMarkdown('Returns the URL of the page that the browser is currently at. Essential for navigation tracking and verification.\n\n');
                } else if (isUserAgentResponse) {
                    markdown.appendMarkdown('#### Returns (UserAgentResponse)\n\n');
                    markdown.appendMarkdown(`🕶️ [UserAgentResponse Documentation](${getTypeDocUrl('UserAgentResponse')})\n\n`);
                    markdown.appendMarkdown('Returns the User-Agent string that was set for the browser session. Essential for device simulation and browser identification customization.\n\n');
                } else if (isWaitForRequestResponse) {
                    markdown.appendMarkdown('#### Returns (WaitForRequest)\n\n');
                    markdown.appendMarkdown(`📡 [WaitForRequest Documentation](${getTypeDocUrl('WaitForRequest')})\n\n`);
                    markdown.appendMarkdown('Returns network request information after a specific request is captured. Includes request method, URL, headers, and timing data for API monitoring.\n\n');
                } else if (isWaitForResponseResponse) {
                    markdown.appendMarkdown('#### Returns (WaitForResponse)\n\n');
                    markdown.appendMarkdown(`📨 [WaitForResponse Documentation](${getTypeDocUrl('WaitForResponse')})\n\n`);
                    markdown.appendMarkdown('Returns network response information after a specific response is received. Includes response status, URL, headers, body content, and timing data for API monitoring.\n\n');
                } else if (isWaitForSelectorResponse) {
                    markdown.appendMarkdown('#### Returns (WaitForSelector)\n\n');
                    markdown.appendMarkdown(`⏳ [WaitForSelector Documentation](${getTypeDocUrl('WaitForSelector')})\n\n`);
                    markdown.appendMarkdown('Returns selector information after a DOM element is found. Includes the matched selector, visibility status, and timing data for element synchronization.\n\n');
                } else if (isWaitForTimeoutResponse) {
                    markdown.appendMarkdown('#### Returns (WaitForTimeout)\n\n');
                    markdown.appendMarkdown(`⏰ [WaitForTimeout Documentation](${getTypeDocUrl('WaitForTimeout')})\n\n`);
                    markdown.appendMarkdown('Returns timing information after waiting for the specified duration. Provides the actual time waited for timing control and workflow synchronization.\n\n');
                } else if (isBrowserResponse) {
                    markdown.appendMarkdown('#### Returns (String)\n\n');
                    markdown.appendMarkdown(`🌐 [Browser Query Documentation](${getOperationDocUrl('browser')})\n\n`);
                    markdown.appendMarkdown('Returns the version of the browser currently being used for automation and testing. Essential for browser compatibility checking and version-specific automation logic.\n\n');
                } else if (isVersionResponse) {
                    markdown.appendMarkdown('#### Returns (String)\n\n');
                    markdown.appendMarkdown(`🔧 [Version Query Documentation](${getOperationDocUrl('version')})\n\n`);
                    markdown.appendMarkdown('Returns the version of the BrowserQL server currently running. Useful for compatibility checking and version-specific feature availability.\n\n');
                } else if (isTypeResponse) {
                    markdown.appendMarkdown('#### Returns (TypeResponse)\n\n');
                    markdown.appendMarkdown(`⌨️ [TypeResponse Documentation](${getTypeDocUrl('TypeResponse')})\n\n`);
                    markdown.appendMarkdown('Returns typing operation data including timing information. Supports realistic human-like typing with configurable delays and interaction validation.\n\n');
                } else {
                    markdown.appendMarkdown('#### Returns\n\n');
                }
                
                operation.returns.forEach(ret => {
                    const typeWithLink = `[${ret.type}](${getTypeDocUrl(ret.type)})`;
                    markdown.appendMarkdown(`- \`${ret.name}\`: ${typeWithLink}\n`);
                    markdown.appendMarkdown(`  ${ret.description}\n\n`);
                });
            }
            
            // Add example if available
            if (operation.example) {
                markdown.appendMarkdown('#### Example\n\n');
                markdown.appendCodeblock(operation.example, 'graphql');
            }
            
            return new vscode.Hover(markdown);
        }
        
        // Check if we're hovering over a directive argument
        const lineText = line.substring(0, position.character);
        const directiveArgMatch = lineText.match(/@(\w+)\s*\(/);
        if (directiveArgMatch) {
            const directiveName = directiveArgMatch[1];
            const directive = browserQLDirectives.find(d => d.name === directiveName);
            if (directive) {
                const arg = directive.arguments.find(a => a.name === word);
                if (arg) {
                    const markdown = new vscode.MarkdownString();
                    markdown.isTrusted = true;
                    markdown.appendMarkdown(`### ${arg.name}\n\n`);
                    const typeWithLink = arg.type.includes('!') 
                        ? `[${arg.type.replace('!', '')}](${getTypeDocUrl(arg.type.replace('!', ''))})!`
                        : `[${arg.type}](${getTypeDocUrl(arg.type)})`;
                    markdown.appendMarkdown(`**Type**: ${typeWithLink}\n\n`);
                    markdown.appendMarkdown(`${arg.description}\n\n`);
                    markdown.appendMarkdown(`🔗 [Type Documentation](${getTypeDocUrl(arg.type.replace('!', ''))})\n`);
                    markdown.appendMarkdown(`📖 [Directive Documentation](${getDirectiveDocUrl(directiveName)})\n`);
                    return new vscode.Hover(markdown);
                }
            }
        }

        // Check if we're hovering over an operation argument
        const operationMatch = lineText.match(/(\w+)\s*\(/);
        if (operationMatch) {
            const operationName = operationMatch[1];
            const operation = browserQLOperations.find(op => op.name === operationName);
            if (operation) {
                const arg = operation.arguments.find(a => a.name === word);
                if (arg) {
                    const markdown = new vscode.MarkdownString();
                    markdown.isTrusted = true; // Allow command links
                    markdown.appendMarkdown(`### ${arg.name}\n\n`);
                    const typeWithLink = arg.type.includes('!') 
                        ? `[${arg.type.replace('!', '')}](${getTypeDocUrl(arg.type.replace('!', ''))})!`
                        : `[${arg.type}](${getTypeDocUrl(arg.type)})`;
                    markdown.appendMarkdown(`**Type**: ${typeWithLink}\n\n`);
                    markdown.appendMarkdown(`${arg.description}\n\n`);
                    if (arg.defaultValue) {
                        markdown.appendMarkdown(`**Default**: ${arg.defaultValue}\n\n`);
                    }
                    markdown.appendMarkdown(`🔗 [Type Documentation](${getTypeDocUrl(arg.type.replace('!', ''))})\n`);
                    return new vscode.Hover(markdown);
                }
            }
        }

        // Check if we're hovering over a return field
        const returnFieldMatch = line.match(/\{\s*(\w+)\s*:/);
        if (returnFieldMatch) {
            const operationLine = this.findOperationLine(document, position.line);
            if (operationLine) {
                const operationMatch = operationLine.match(/(\w+)\s*\(/);
                if (operationMatch) {
                    const operationName = operationMatch[1];
                    const operation = browserQLOperations.find(op => op.name === operationName);
                    if (operation) {
                        const returnField = operation.returns.find(r => r.name === word);
                        if (returnField) {
                            const markdown = new vscode.MarkdownString();
                            markdown.isTrusted = true; // Allow command links
                            markdown.appendMarkdown(`### ${returnField.name}\n\n`);
                            const typeWithLink = `[${returnField.type}](${getTypeDocUrl(returnField.type)})`;
                            markdown.appendMarkdown(`**Type**: ${typeWithLink}\n\n`);
                            markdown.appendMarkdown(`${returnField.description}\n\n`);
                            
                            // Determine appropriate documentation link
                            const isHttpResponse = ['back', 'content', 'forward', 'goto', 'reload', 'waitForNavigation'].includes(operationName);
                            const isClickResponse = ['checkbox', 'click'].includes(operationName);
                            const isCookieResponse = ['cookies'].includes(operationName);
                            const isEvaluateResponse = ['evaluate'].includes(operationName);
                            const isHoverResponse = ['hover'].includes(operationName);
                            const isHtmlResponse = ['html'].includes(operationName);
                            const isJavaScriptResponse = ['javaScriptEnabled'].includes(operationName);
                            const isLiveURLResponse = ['liveURL'].includes(operationName);
                            const isMapSelectorResponse = ['mapSelector'].includes(operationName);
                            const isPDFResponse = ['pdf'].includes(operationName);
                            const isDefaultResponse = ['preferences'].includes(operationName);
                            const isProxyResponse = ['proxy'].includes(operationName);
                            const isQuerySelectorResponse = ['querySelector', 'querySelectorAll'].includes(operationName);
            const isReconnectionResponse = ['reconnect'].includes(operationName);
            const isRejectResponse = ['reject'].includes(operationName);
            const isRequestResponse = ['request'].includes(operationName);
                            const isResponseResponse = ['response'].includes(operationName);
                            const isScreenshotResponse = ['screenshot'].includes(operationName);
                            const isScrollResponse = ['scroll'].includes(operationName);
            const isSelectResponse = ['select'].includes(operationName);
            const isHTTPHeadersResponse = ['setExtraHTTPHeaders'].includes(operationName);
                            const isCaptchaResponse = ['solve', 'verify'].includes(operationName);
                            const isTextResponse = ['text'].includes(operationName);
                            const isTitleResponse = ['title'].includes(operationName);
                            const isURLResponse = ['url'].includes(operationName);
                            const isUserAgentResponse = ['userAgent'].includes(operationName);
                            const isWaitForRequestResponse = ['waitForRequest'].includes(operationName);
                            const isWaitForResponseResponse = ['waitForResponse'].includes(operationName);
                            const isWaitForSelectorResponse = ['waitForSelector'].includes(operationName);
                            const isWaitForTimeoutResponse = ['waitForTimeout'].includes(operationName);
                            const isBrowserResponse = ['browser'].includes(operationName);
                            const isVersionResponse = ['version'].includes(operationName);
                            const isTypeResponse = ['type'].includes(operationName);
                            
                            if (isHttpResponse) {
                                markdown.appendMarkdown(`📋 [HTTPResponse Documentation](${getTypeDocUrl('HTTPResponse')})\n`);
                            } else if (isClickResponse) {
                                markdown.appendMarkdown(`📋 [ClickResponse Documentation](${getTypeDocUrl('ClickResponse')})\n`);
                            } else if (isCookieResponse) {
                                markdown.appendMarkdown(`📋 [CookieResponse Documentation](${getTypeDocUrl('CookieResponse')})\n`);
                            } else if (isEvaluateResponse) {
                                markdown.appendMarkdown(`📋 [EvaluateResponse Documentation](${getTypeDocUrl('EvaluateResponse')})\n`);
                            } else if (isHoverResponse) {
                                markdown.appendMarkdown(`📋 [HoverResponse Documentation](${getTypeDocUrl('HoverResponse')})\n`);
                            } else if (isHtmlResponse) {
                                markdown.appendMarkdown(`📋 [HTMLResponse Documentation](${getTypeDocUrl('HTMLResponse')})\n`);
                            } else if (isJavaScriptResponse) {
                                markdown.appendMarkdown(`📋 [JavaScriptResponse Documentation](${getTypeDocUrl('JavaScriptResponse')})\n`);
                            } else if (isLiveURLResponse) {
                                markdown.appendMarkdown(`📋 [LiveURLResponse Documentation](${getTypeDocUrl('LiveURLResponse')})\n`);
                            } else if (isMapSelectorResponse) {
                                markdown.appendMarkdown(`📋 [MapSelectorResponse Documentation](${getTypeDocUrl('MapSelectorResponse')})\n`);
                            } else if (isPDFResponse) {
                                markdown.appendMarkdown(`📋 [PDFResponse Documentation](${getTypeDocUrl('PDFResponse')})\n`);
                            } else if (isDefaultResponse) {
                                markdown.appendMarkdown(`📋 [DefaultResponse Documentation](${getTypeDocUrl('DefaultResponse')})\n`);
                            } else if (isProxyResponse) {
                                markdown.appendMarkdown(`📋 [ProxyResponse Documentation](${getTypeDocUrl('ProxyResponse')})\n`);
                                        } else if (isQuerySelectorResponse) {
                markdown.appendMarkdown(`📋 [QuerySelectorResponse Documentation](${getTypeDocUrl('QuerySelectorResponse')})\n`);
            } else if (isReconnectionResponse) {
                markdown.appendMarkdown(`🔌 [ReconnectionResponse Documentation](${getTypeDocUrl('ReconnectionResponse')})\n`);
            } else if (isRejectResponse) {
                markdown.appendMarkdown(`🚫 [RejectResponse Documentation](${getTypeDocUrl('RejectResponse')})\n`);
            } else if (isRequestResponse) {
                markdown.appendMarkdown(`📡 [RequestResponse Documentation](${getTypeDocUrl('RequestResponse')})\n`);
            } else if (isResponseResponse) {
                markdown.appendMarkdown(`📨 [ResponseResponse Documentation](${getTypeDocUrl('ResponseResponse')})\n`);
            } else if (isScreenshotResponse) {
                markdown.appendMarkdown(`📸 [ScreenshotResponse Documentation](${getTypeDocUrl('ScreenshotResponse')})\n`);
            } else if (isScrollResponse) {
                markdown.appendMarkdown(`📜 [ScrollResponse Documentation](${getTypeDocUrl('ScrollResponse')})\n`);
            } else if (isSelectResponse) {
                markdown.appendMarkdown(`🔽 [SelectResponse Documentation](${getTypeDocUrl('SelectResponse')})\n`);
            } else if (isHTTPHeadersResponse) {
                markdown.appendMarkdown(`🌐 [HTTPHeadersResponse Documentation](${getTypeDocUrl('HTTPHeadersResponse')})\n`);
                            } else if (isCaptchaResponse) {
                                markdown.appendMarkdown(`🧩 [CaptchaResponse Documentation](${getTypeDocUrl('CaptchaResponse')})\n`);
                            } else if (isTextResponse) {
                                markdown.appendMarkdown(`📝 [TextResponse Documentation](${getTypeDocUrl('TextResponse')})\n`);
                            } else if (isTitleResponse) {
                                markdown.appendMarkdown(`📄 [TitleResponse Documentation](${getTypeDocUrl('TitleResponse')})\n`);
                            } else if (isURLResponse) {
                                markdown.appendMarkdown(`🔗 [URLResponse Documentation](${getTypeDocUrl('URLResponse')})\n`);
                            } else if (isUserAgentResponse) {
                                markdown.appendMarkdown(`🕶️ [UserAgentResponse Documentation](${getTypeDocUrl('UserAgentResponse')})\n`);
                            } else if (isWaitForRequestResponse) {
                                markdown.appendMarkdown(`📡 [WaitForRequest Documentation](${getTypeDocUrl('WaitForRequest')})\n`);
                            } else if (isWaitForResponseResponse) {
                                markdown.appendMarkdown(`📨 [WaitForResponse Documentation](${getTypeDocUrl('WaitForResponse')})\n`);
                            } else if (isWaitForSelectorResponse) {
                                markdown.appendMarkdown(`⏳ [WaitForSelector Documentation](${getTypeDocUrl('WaitForSelector')})\n`);
                            } else if (isWaitForTimeoutResponse) {
                                markdown.appendMarkdown(`⏰ [WaitForTimeout Documentation](${getTypeDocUrl('WaitForTimeout')})\n`);
                            } else if (isBrowserResponse) {
                                markdown.appendMarkdown(`🌐 [Browser Query Documentation](${getOperationDocUrl('browser')})\n`);
                            } else if (isVersionResponse) {
                                markdown.appendMarkdown(`🔧 [Version Query Documentation](${getOperationDocUrl('version')})\n`);
                            } else if (isTypeResponse) {
                                markdown.appendMarkdown(`⌨️ [TypeResponse Documentation](${getTypeDocUrl('TypeResponse')})\n`);
                            }
                            
                            return new vscode.Hover(markdown);
                        }
                    }
                }
            }
        }
        
        return null;
    }

    private findOperationLine(document: vscode.TextDocument, currentLine: number): string | null {
        for (let i = currentLine; i >= 0; i--) {
            const line = document.lineAt(i).text;
            if (line.includes('(') && !line.includes('{')) {
                return line;
            }
        }
        return null;
    }
} 