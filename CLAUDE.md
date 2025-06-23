# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VS Code extension that provides comprehensive language support for BrowserQL, a GraphQL-like query language for browser automation. The extension includes syntax highlighting, intelligent autocomplete, hover documentation, code formatting, and custom themes.

## Development Commands

Build and compilation:
```bash
npm run compile          # Compile TypeScript to JavaScript
npm run watch           # Watch mode for development  
npm run vscode:prepublish # Prepare for publishing
```

Code quality:
```bash
npm run lint            # ESLint validation
npm run pretest         # Compile and lint before testing
npm run test           # Run tests
```

Package management:
```bash
npm install            # Install dependencies
```

## Core Architecture

### Main Extension Components

- **`src/extension.ts`** - Main extension entry point that registers all language providers
- **`src/browserql-schema.ts`** - Complete BrowserQL schema definitions (operations, types, enums)
- **`src/completion-provider.ts`** - Intelligent autocomplete with context-aware suggestions
- **`src/hover-provider.ts`** - Rich hover documentation with links to official docs
- **`src/formatter.ts`** - Document formatting for BrowserQL syntax

### Language Support Features

The extension registers multiple VS Code language providers:
- CompletionItemProvider for autocomplete with operation, argument, and return field suggestions
- HoverProvider for contextual documentation with type information and external links
- DocumentFormattingEditProvider for code formatting
- DefinitionProvider (placeholder implementation)
- DocumentSymbolProvider for outline and navigation
- FoldingRangeProvider for code folding

### Schema Architecture

The BrowserQL schema (`browserql-schema.ts`) defines:
- **Operations**: 50+ browser automation operations (goto, click, type, screenshot, etc.)
- **Directives**: GraphQL directives (@include, @skip) for conditional execution
- **Types**: Response types, input types, enums for various browser operations
- **Documentation URLs**: Mapping to official BrowserQL documentation

### Language Configuration

- **File Extension**: `.bql` files are recognized as BrowserQL
- **Syntax Highlighting**: TextMate grammar in `syntaxes/browserql.tmLanguage.json`
- **Language Config**: Bracket matching, auto-closing, indentation rules in `language-configuration.json`
- **Themes**: Custom dark/light themes optimized for BrowserQL syntax

## Key Implementation Details

### Completion Provider Context Logic
The completion provider uses line prefix analysis to provide context-aware suggestions:
- Keywords when starting new lines
- Operations when inside mutation/query blocks
- Arguments when inside operation parentheses  
- Enum values based on argument types (WaitUntilHistory vs WaitUntilGoto)
- Return fields when inside operation result blocks
- Directive completions with @-prefix

### Hover Provider Documentation
Rich markdown hover documentation includes:
- Operation descriptions with argument and return type details
- Clickable links to official BrowserQL documentation
- Type-specific documentation URLs for enums, objects, and scalars
- Context-aware response type documentation based on operation

### Schema Data Structure
Operations are defined with:
```typescript
interface BrowserQLOperation {
    name: string;
    description: string;
    arguments: BrowserQLArgument[];
    returns: BrowserQLReturn[];
    example?: string;
}
```

## Testing

The `test-workspace/` directory contains 30+ `.bql` files covering all BrowserQL operations for testing language features.

## Build Output

Compiled JavaScript files are output to `/out/` directory. The extension uses CommonJS modules targeting ES2020.