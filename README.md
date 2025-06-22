# BrowserQL VS Code Extension

This extension provides comprehensive language support for BrowserQL in Visual Studio Code, including syntax highlighting, intelligent autocompletion, hover documentation with links to official docs, and comprehensive schema validation.

## Features

### 🎨 **Syntax Highlighting**
- Full syntax highlighting for BrowserQL files (`.bql`)
- Support for all BrowserQL operations, keywords, and GraphQL-style syntax
- **JavaScript Highlighting**: Embedded JavaScript syntax highlighting within `evaluate` operation `content` parameters
- Custom color theme for optimal BrowserQL development experience

### 🧠 **Intelligent Code Completion** 
- **Smart Operation Completion**: Context-aware suggestions for all BrowserQL mutations
- **Argument Completion**: Autocomplete function arguments with type information
- **Return Field Completion**: Intelligent completion for response fields
- **Enum Value Completion**: Context-specific enum values (e.g., `WaitUntilHistory` vs `WaitUntilGoto`)
- **Links to Documentation**: Each completion item includes links to official BrowserQL docs

### 📖 **Rich Hover Documentation**
- **Operation Details**: Hover over any operation to see full documentation
- **Argument Information**: Detailed type information and descriptions
- **Return Type Details**: Complete HTTPResponse and other return type documentation  
- **Direct Documentation Links**: Click to open official BrowserQL documentation
- **Type-Specific Links**: Links to enum, object, and scalar type documentation

### 🔧 **Complete BrowserQL Schema Support**
- **All Operations**: Full support for mutations including `content`, `back`, `forward`, `goto`, `hover`, `html`, `click`, `type`, `text`, etc.
- **GraphQL Directives**: Full support for `@include` and `@skip` directives with conditional field execution
- **Accurate Type System**: Proper `HTTPResponse`, `HoverResponse`, `HTMLResponse`, `WaitUntilHistory`, `WaitUntilGoto` enum handling
- **Default Values**: Correct default values matching official BrowserQL specification
- **Required/Optional Arguments**: Proper validation of required vs optional parameters

### 📝 **Code Snippets**
- **Quick Templates**: Snippet shortcuts for common BrowserQL patterns
- **Smart Placeholders**: Tab-navigable placeholders with enum value choices
- **Best Practices**: Snippets follow BrowserQL best practices and conventions

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies  
3. Press F5 to start debugging the extension in a new VS Code window

## Usage

### Basic Usage
1. Open a `.bql` file in VS Code
2. The extension automatically activates and provides full language support
3. Start typing to see intelligent autocompletion suggestions
4. Hover over operations, arguments, or return fields for detailed documentation

### Example BrowserQL Code
```bql
mutation ContentExample {
  # Set HTML content with wait condition
  content(html: "<h1>Hello, World!</h1>", waitUntil: domContentLoaded) {
    status    # HTTP status code
    time      # Navigation timing
    text @include(if: true)   # Include when true
    url @skip(if: false)      # Skip when true (so included)
  }
  
  # Navigate with optional parameters (uses defaults)
  goto(url: "https://example.com") {
    status
    time @include(if: true)   # Always included
    url @skip(if: false)      # Never skipped
  }
  
  # Navigate with timeout and waitUntil parameters
  goto(
    url: "https://browserless.io"
    timeout: 45000
    waitUntil: firstMeaningfulPaint
  ) {
    status
    time
    text
    url
  }
  
  back(waitUntil: load) {
    status
    time @skip(if: true)      # Always skipped
    text @include(if: true)   # Always included
    url
  }
}
```

### Documentation Links
- Hover over any operation name to see a direct link to its documentation
- Click type names in hover tooltips to view type documentation
- Completion items include documentation links for easy reference

### Supported BrowserQL Operations
The extension provides full support for all major BrowserQL operations:

**Navigation & History**
- `goto` - Navigate to URLs with various wait conditions
- `back` - Go back in browser history  
- `forward` - Go forward in browser history
- `content` - Set HTML content on the page
- `reload` - Reload the current page

**Element Interaction**
- `click` - Click on elements (returns ClickResponse with coordinates)
- `type` - Type text into inputs 
- `select` - Select dropdown options
- `checkbox` - Check/uncheck checkboxes (returns ClickResponse with coordinates)
- `hover` - Hover over elements (returns HoverResponse with coordinates and timing)
- `scroll` - Scroll to elements
- `setExtraHTTPHeaders` - Configure custom HTTP headers

**Data Extraction**
- `text` - Extract text content
- `html` - Get HTML content (with advanced cleaning for LLMs)
- `screenshot` - Take screenshots
- `title` - Get page title
- `url` - Get current URL

**Advanced Operations**
- `evaluate` - Execute JavaScript (with embedded JS syntax highlighting)
- `waitForSelector` - Wait for elements
- `waitForNavigation` - Wait for page loads
- `cookies` - Manage cookies (get/set with full attribute support)
- `javaScriptEnabled` - Control JavaScript execution (enable/disable with navigation effects)
- `liveURL` - Create live browser streaming sessions (shareable URLs with quality/interactivity controls)
- `mapSelector` - Extract structured data from multiple DOM elements (like querySelectorAll with nested mapping)
- `pdf` - Generate professional PDFs with custom formatting, headers/footers, and accessibility features
- `preferences` - Configure session-wide defaults like timeout values for all operations
- `proxy` - Configure advanced request routing through residential or external proxies with geographic targeting
- `querySelector` - Query single DOM element with comprehensive attribute and content extraction  
- `querySelectorAll` - Query multiple DOM elements with comprehensive attribute and content extraction
- `reconnect` - Get reconnection information for session continuity and debugging
- `reject` - Block requests by URL patterns, methods, or resource types with logical operators
- `reload` - Reload the current page with configurable timeout and wait conditions
- `request` - Monitor and capture browser network requests with filtering by URL, method, and resource type

**GraphQL Directives**
- `@include(if: Boolean!)` - Include field conditionally (include when true)
- `@skip(if: Boolean!)` - Skip field conditionally (skip when true)

> **Note**: `@include` and `@skip` are complementary directives:
> - `@include(if: true)` = field is included
> - `@skip(if: true)` = field is excluded
> - `@include(if: false)` = field is excluded  
> - `@skip(if: false)` = field is included

### Directive Usage Examples
```bql
mutation DirectiveExample {
  content(html: "<div>Test</div>") {
    status
    time @include(if: true)     # Include when true
    text @skip(if: false)       # Skip when true (so included)
    url @skip(if: true)         # Skip when true (so excluded)
  }
  
  # Combining both directives
  back(waitUntil: load) {
    status @include(if: true)   # Always included
    time @skip(if: true)        # Always skipped
    text @include(if: false)    # Always excluded
    url @skip(if: false)        # Never skipped
  }
}
```

### Cookie Management Examples
```bql
mutation CookieManagement {
  # Get existing cookies from the page
  getCookies: cookies {
    cookies {
      name
      value
      domain
      path
      secure
      httpOnly
      sameSite
      expires
    }
    time
  }
  
  # Set new cookies with various attributes
  setCookies: cookies(cookies: [
    {
      name: "session_id"
      value: "abc123"
      url: "https://example.com"
      secure: true
      httpOnly: true
      sameSite: Strict
    },
    {
      name: "preferences"
      value: "dark_mode=true"
      domain: ".example.com"
      path: "/"
      secure: false
      httpOnly: false
      sameSite: Lax
    }
  ]) {
    cookies {
      name
      value
      domain
    }
    time
  }
}
```

### JavaScript Evaluation with Syntax Highlighting
The `evaluate` operation includes **embedded JavaScript syntax highlighting** for improved development experience. JavaScript code within `content` parameters gets full syntax highlighting, IntelliSense, and error detection.

```bql
mutation JavaScriptEvaluation {
  # Simple JavaScript with highlighting
  simple: evaluate(content: "Math.sqrt(16) * Math.PI") {
    value
  }
  
  # Complex JavaScript with full syntax highlighting
  complex: evaluate(content: `
    // DOM manipulation with syntax highlighting
    const elements = document.querySelectorAll('a');
    const links = Array.from(elements).map(link => ({
      text: link.textContent.trim(),
      href: link.href,
      visible: link.offsetParent !== null
    }));
    
    // Async operations are supported
    const delayedResult = await new Promise(resolve => {
      setTimeout(() => resolve({
        totalLinks: links.length,
        visibleLinks: links.filter(l => l.visible).length,
        timestamp: Date.now()
      }), 100);
    });
    
    return delayedResult;
  `, timeout: 30000) {
    value
  }
  
  # External script loading
  external: evaluate(url: "https://example.com/script.js") {
    value
  }
}
```

#### JavaScript Highlighting Features:
- **Syntax Highlighting**: Full JavaScript syntax highlighting within template literals, double quotes, and single quotes
- **IntelliSense**: Code completion for JavaScript APIs when available
- **Error Detection**: Syntax error highlighting for invalid JavaScript
- **Async Support**: Proper highlighting for async/await patterns
- **DOM APIs**: Support for browser and DOM API highlighting

### Navigation with Goto Operation
The `goto` operation supports flexible navigation with optional parameters and intelligent defaults based on the [official BrowserQL specification](https://docs.browserless.io/bql-schema/operations/mutations/goto).

```bql
mutation NavigationExamples {
  # Basic navigation (uses defaults: timeout=30000ms, waitUntil=load)
  basic: goto(url: "https://example.com") {
    status
  }
  
  # Navigation with custom timeout (default waitUntil=load)
  withTimeout: goto(
    url: "https://browserless.io"
    timeout: 45000
  ) {
    status
    time
    url
  }
  
  # Navigation with specific wait condition (default timeout=30000ms)
  withWaitUntil: goto(
    url: "https://docs.browserless.io"
    waitUntil: firstMeaningfulPaint
  ) {
    status
    time
    text
    url
  }
  
  # Full navigation with all parameters
  complete: goto(
    url: "https://github.com/browserless"
    timeout: 60000
    waitUntil: domContentLoaded
  ) {
    status
    time
    text
    url
  }
}
```

#### Goto Parameters:
- **url** (String!, required): The fully-qualified URL to navigate to
- **timeout** (Float, optional): Maximum wait time in milliseconds (default: 30000)
- **waitUntil** (WaitUntilGoto, optional): When to consider navigation complete (default: load)

#### WaitUntilGoto Options:
- `load` - Page load event (default)
- `commit` - Network response received and document starts loading
- `domContentLoaded` - DOMContentLoaded event fires
- `firstMeaningfulPaint` - Primary content visible to user
- `networkidle0` - No network connections for 500ms
- `networkidle2` - No more than 2 network connections for 500ms

### Element Interaction with Hover
The `hover` operation provides flexible element interaction with both selector-based and coordinate-based hovering, based on the [official BrowserQL specification](https://docs.browserless.io/bql-schema/operations/mutations/hover).

```bql
mutation HoverExamples {
  # Basic hover on element (uses defaults)
  basic: hover(selector: "a") {
    time
  }
  
  # Hover with coordinates
  coordinates: hover(x: 100, y: 200) {
    x
    y
    time
  }
  
  # Hover with all options
  complete: hover(
    selector: ".menu-item"
    scroll: true
    visible: true
    wait: true
    timeout: 10000
  ) {
    selector
    x
    y
    time
  }
  
  # Hover for tooltip activation
  tooltip: hover(
    selector: "[data-tooltip]"
    visible: true
  ) {
    selector
    time
  }
}
```

#### Hover Parameters:
- **scroll** (Boolean, optional): Whether to scroll to element (default: true)
- **selector** (String, optional): CSS selector of element to hover on
- **timeout** (Float, optional): Maximum wait time in milliseconds (default: 30000)
- **visible** (Boolean, optional): Only hover if element is visible (default: false)
- **wait** (Boolean, optional): Wait for element to be present in DOM (default: true)
- **x** (Float, optional): X coordinate in pixels for direct coordinate hovering
- **y** (Float, optional): Y coordinate in pixels for direct coordinate hovering

#### HoverResponse Fields:
- `selector` - The CSS selector used (if provided)
- `x` - X coordinate of the hover in pixels
- `y` - Y coordinate of the hover in pixels  
- `time` - Time elapsed in milliseconds for the hover operation

### HTML Extraction with Advanced Cleaning
The `html` operation provides powerful HTML content extraction with advanced cleaning capabilities for LLMs and data processing, based on the [official BrowserQL specification](https://docs.browserless.io/bql-schema/operations/mutations/html).

```bql
mutation HTMLExamples {
  # Basic HTML extraction (entire page)
  fullPage: html {
    html
  }
  
  # HTML from specific element
  elementHTML: html(selector: "main") {
    html
    time
  }
  
  # HTML with visibility check
  visibleOnly: html(
    selector: ".content"
    visible: true
    timeout: 10000
  ) {
    html
    time
  }
  
  # Clean HTML for LLMs - removes attributes and non-text nodes
  cleanForLLM: html(clean: {
    removeAttributes: true
    removeNonTextNodes: true
  }) {
    html
    time
  }
  
  # Ultra-clean HTML - maximum size reduction
  ultraClean: html(
    selector: "article"
    clean: {
      removeAttributes: true
      removeNonTextNodes: true
      removeWhitespace: true
      removeNewlines: true
    }
  ) {
    html
    time
  }
}
```

#### HTML Parameters:
- **selector** (String, optional): DOM selector for specific element extraction
- **timeout** (Float, optional): Maximum wait time in milliseconds (default: 30000)
- **visible** (Boolean, optional): Only extract if element is visible (default: false)
- **clean** (CleanInput, optional): Advanced cleaning options for size optimization

#### CleanInput Options:
- `removeAttributes` - Remove all DOM attributes (class, id, style, etc.)
- `removeNonTextNodes` - Remove script, style, comment nodes
- `removeWhitespace` - Remove excessive whitespace
- `removeNewlines` - Remove unnecessary newlines

#### HTMLResponse Fields:
- `html` - The extracted HTML content (cleaned if specified)
- `time` - Time elapsed in milliseconds for the extraction

#### Benefits of HTML Cleaning:
- **🚀 Size Reduction**: Can save nearly 1,000x payload size
- **🤖 LLM Optimization**: Clean HTML perfect for language model processing
- **📊 Data Processing**: Simplified markup for parsing and analysis
- **⚡ Performance**: Faster transfers and processing of cleaned content

### Conditional Operations (if/ifnot)

The extension provides full support for BrowserQL's conditional operations, enabling dynamic, context-aware browser automation based on the [official if](https://docs.browserless.io/bql-schema/operations/mutations/if) and [ifnot](https://docs.browserless.io/bql-schema/operations/mutations/ifnot) specifications.

#### If Operation
Execute nested operations when a condition is `true`:

```bql
mutation ConditionalExecution {
  goto(url: "https://example.com") {
    status
  }

  # Execute screenshot only if h1 element exists
  if(selector: "h1") {
    screenshot {
      base64
    }
  }
  
  # Handle modal dialogs with visibility check
  if(selector: ".modal", visible: true) {
    click(selector: ".close-button") {
      time
    }
  }
  
  # Complex form handling
  if(selector: "form.login") {
    type(selector: "input[name='email']", text: "user@example.com") {
      time
    }
    type(selector: "input[name='password']", text: "password") {
      time
    }
    click(selector: "button[type='submit']") {
      time
    }
  }
}
```

#### IfNot Operation
Execute nested operations when a condition is `false` (perfect for fallback scenarios):

```bql
mutation FallbackHandling {
  goto(url: "https://example.com") {
    status
  }

  # Wait for loading to complete, then proceed
  ifnot(selector: ".loading-spinner") {
    click(selector: "button.primary") {
      time
    }
  }
  
  # Fallback form handling
  ifnot(selector: ".advanced-form") {
    type(selector: "input[name='query']", text: "search term") {
      time
    }
    click(selector: "button.search") {
      time
    }
  }
  
  # Error handling
  ifnot(selector: ".success-message") {
    text(selector: ".error-message") {
      text
      time
    }
    screenshot {
      base64
    }
  }
}
```

#### Conditional Operation Parameters

**If Operation Parameters:**
- **request** (RequestInput, optional): Trigger when request conditions are met
- **response** (ResponseInput, optional): Trigger when response conditions are met  
- **selector** (String, optional): Trigger when selector is immediately present
- **visible** (Boolean, optional): Consider element visibility (default: false)

**IfNot Operation Parameters:**
- **request** (RequestInput, optional): Trigger when request conditions are NOT met
- **response** (ResponseInput, optional): Trigger when response conditions are NOT met
- **selector** (String, optional): Trigger when selector is NOT present

#### Advanced Conditional Examples

```bql
mutation AdvancedConditionals {
  goto(url: "https://example.com") {
    status
  }
  
  # Authentication flow handling
  ifnot(selector: ".user-dashboard") {
    # User not logged in, show login flow
    click(selector: ".login-button") {
      time
    }
    type(selector: "#username", text: "testuser") {
      time
    }
    type(selector: "#password", text: "testpass") {
      time
    }
    click(selector: ".submit-login") {
      time
    }
  }
  
  # Error handling with screenshots
  ifnot(selector: ".success-message") {
    # No success message found, capture error state
    text(selector: ".error-message") {
      text
      time
    }
    screenshot {
      base64
    }
  }
  
  # Feature detection and fallbacks
  if(selector: ".advanced-features") {
    # Use advanced UI
    click(selector: ".advanced-button") {
      time
    }
  }
  
  ifnot(selector: ".advanced-features") {
    # Fallback to simple UI
    click(selector: ".simple-button") {
      time
    }
  }
  
  # Modal handling
  if(selector: ".modal-overlay", visible: true) {
    # Close modal if it's visible
    click(selector: ".modal-close") {
      time
    }
  }
  
  # Loading state management
  ifnot(selector: ".loading") {
    # Page loaded, proceed with interactions
    click(selector: ".start-action") {
      time
    }
    
    html(selector: ".results") {
      html
      time
    }
  }
}
```

#### Conditional Operation Features

- **🎯 Precise Conditions**: Selector-based, request/response-based, and visibility-based conditions
- **🔄 Nested Operations**: Full support for any BrowserQL operation inside conditional blocks
- **🧠 Smart IntelliSense**: Context-aware completion works inside conditional blocks
- **🎨 Syntax Highlighting**: Proper highlighting for nested conditional structures
- **📖 Documentation**: Hover support with links to conditional operation docs
- **⚡ Performance**: Point-in-time checks without waiting (use `wait` operations for async conditions)

#### Use Cases

- **🔐 Authentication Flows**: Different paths for logged in/out users
- **⏳ Loading State Handling**: Wait for spinners to disappear before proceeding
- **🪟 Modal Management**: Close popups and overlays when they appear
- **📝 Form Adaptation**: Use different forms based on page availability
- **🚨 Error Handling**: Take screenshots and extract errors when operations fail
- **🔍 Feature Detection**: Adapt behavior based on available page features
- **🧪 A/B Testing Support**: Handle different page variations dynamically
- **♿ Accessibility**: Graceful degradation for different page states

### Live URL Streaming (liveURL)

The extension provides comprehensive support for creating live browser streaming sessions, based on the [official liveURL documentation](https://docs.browserless.io/bql-schema/operations/mutations/live-url). This operation generates shareable URLs for real-time browser streaming with configurable quality, interactivity, and viewport settings.

#### Basic Live URL Streaming

```bql
mutation LiveStreaming {
  # Navigate to page first
  goto(url: "https://example.com") {
    status
  }

  # Basic live URL with default settings
  basicStream: liveURL {
    liveURL
  }

  # View-only stream (non-interactive)
  viewOnly: liveURL(interactable: false) {
    liveURL
  }

  # Fixed viewport (non-resizable)
  fixedViewport: liveURL(resizable: false) {
    liveURL
  }
}
```

#### Advanced Streaming Configurations

```bql
mutation AdvancedStreaming {
  goto(url: "https://app.example.com") {
    status
  }

  # Low quality for bandwidth optimization
  lowBandwidth: liveURL(quality: 20, type: jpeg) {
    liveURL
  }

  # High quality PNG stream
  highQuality: liveURL(type: png) {
    liveURL
  }

  # Timed session with custom configuration
  timedSession: liveURL(
    timeout: 300000     # 5 minutes
    interactable: true
    type: jpeg
    quality: 80
    resizable: false
  ) {
    liveURL
  }

  # Mobile-optimized stream
  mobileStream: liveURL(
    quality: 50
    type: jpeg
    resizable: true
    interactable: true
  ) {
    liveURL
  }
}
```

#### Live URL Parameters

- **timeout** (Float, optional): Maximum time for browser session (milliseconds)
  - Sets session duration limit
  - User receives prompt when time expires
  - No default (unlimited session)

- **interactable** (Boolean, optional): Enable user interaction (default: true)  
  - `true`: Allow click and mouse events through stream
  - `false`: View-only mode, no user interaction

- **type** (LiveURLStreamType, optional): Stream image format (default: jpeg)
  - `jpeg`: Lower bandwidth, supports quality settings
  - `png`: Higher quality, more bandwidth consumption

- **quality** (Int, optional): Stream quality 1-100 (default: 100)
  - Only effective when `type: jpeg`
  - Lower values = less bandwidth, reduced quality
  - Higher values = more bandwidth, better quality

- **resizable** (Boolean, optional): Browser viewport adaptation (default: true)
  - `true`: Resize browser to match user's screen size
  - `false`: Maintain current viewport, preserve aspect ratio

#### LiveURLResponse Fields

- `liveURL` - String containing the fully-qualified streaming URL

#### Streaming Use Cases

**🎥 Demo & Presentations**
```bql
# Interactive demo with optimal quality
demoStream: liveURL(
  timeout: 1800000  # 30 minutes
  interactable: true
  type: jpeg
  quality: 85
  resizable: true
) {
  liveURL
}
```

**📊 Monitoring & Dashboards**
```bql
# View-only monitoring with high quality
monitoringStream: liveURL(
  interactable: false
  type: png
  resizable: false
  timeout: 3600000  # 1 hour
) {
  liveURL
}
```

**📱 Mobile-Optimized Streaming**
```bql
# Bandwidth-conscious mobile stream
mobileStream: liveURL(
  quality: 40
  type: jpeg
  resizable: true
  interactable: true
) {
  liveURL
}
```

**🎓 Training & Support**
```bql
# Interactive training session
trainingStream: liveURL(
  timeout: 3600000  # 1 hour
  interactable: true
  type: jpeg
  quality: 70
  resizable: true
) {
  liveURL
}
```

#### Best Practices

- **📡 Bandwidth Optimization**: Use `jpeg` with quality 20-60 for low bandwidth
- **🖥️ High Fidelity**: Use `png` for pixel-perfect reproduction  
- **👥 Interactive Sessions**: Set `interactable: true` for user participation
- **📺 View-Only**: Set `interactable: false` for demonstrations
- **⏰ Session Management**: Always set `timeout` for resource management
- **📱 Mobile Support**: Use `resizable: true` for responsive streaming
- **🔒 Fixed Layout**: Use `resizable: false` for consistent viewport

#### Conditional Streaming

```bql
mutation ConditionalStreaming {
  # Only create stream if required
  if(selector: ".streaming-enabled") {
    interactiveStream: liveURL(
      interactable: true
      type: jpeg
      quality: 80
    ) {
      liveURL
    }
  }

  # Fallback for non-streaming pages
  ifnot(selector: ".no-streaming") {
    basicStream: liveURL(
      quality: 50
      interactable: false
    ) {
      liveURL
    }
  }
}
```

#### Quality vs Bandwidth Guidelines

| Quality | Use Case | Bandwidth | Visual Quality |
|---------|----------|-----------|----------------|
| 10-30 | Mobile/Low bandwidth | Minimal | Basic readability |
| 40-60 | Standard streaming | Moderate | Good quality |
| 70-85 | Professional demos | Higher | High quality |
| 90-100 | Pixel-perfect needs | Maximum | Excellent |
| PNG | Screenshots/Static | Highest | Perfect |

### Data Extraction & Mapping (mapSelector)

The extension provides comprehensive support for structured data extraction from web pages, based on the [official mapSelector documentation](https://docs.browserless.io/bql-schema/operations/mutations/map-selector). This operation functions like `document.querySelectorAll` combined with functional programming's `map`, enabling extraction of hierarchical data from repetitive page elements.

#### Basic Data Extraction

```bql
mutation BasicDataExtraction {
  goto(url: "https://news.ycombinator.com") {
    status
  }

  # Simple data extraction
  stories: mapSelector(selector: ".athing") {
    innerHTML
    innerText
    tagName
  }

  # Data extraction with aliases
  posts: mapSelector(selector: ".titleline") {
    title: innerText
    content: innerHTML
    elementType: tagName
  }
}
```

#### Advanced Nested Data Extraction

```bql
mutation NestedDataExtraction {
  goto(url: "https://example-shop.com") {
    status
  }

  # Product listings with nested data
  products: mapSelector(selector: ".product-item") {
    productTitle: innerText
    productHTML: innerHTML
    
    # Extract pricing information
    pricing: mapSelector(selector: ".price") {
      priceText: innerText
      priceHTML: innerHTML
      attributes {
        name
        value
      }
    }
    
    # Extract product images
    images: mapSelector(selector: "img") {
      attributes {
        name
        value
      }
    }
    
    # Extract product links
    links: mapSelector(selector: "a") {
      linkText: innerText
      attributes {
        name
        value
      }
    }
  }
}
```

#### Complex Hierarchical Data Extraction

```bql
mutation HierarchicalExtraction {
  goto(url: "https://news.example.com") {
    status
  }

  # Multi-level nested data extraction
  articles: mapSelector(selector: ".article") {
    headline: innerText
    content: innerHTML
    
    # Get article authors
    authors: mapSelector(selector: ".author") {
      authorName: innerText
      authorBio: innerHTML
      attributes {
        name
        value
      }
    }
    
    # Get article comments
    comments: mapSelector(selector: ".comment") {
      commentText: innerText
      
      # Get comment authors (deeply nested)
      commentAuthors: mapSelector(selector: ".comment-author") {
        commentAuthorName: innerText
        attributes {
          name
          value
        }
      }
    }
    
    # Get article tags
    tags: mapSelector(selector: ".tag") {
      tagName: innerText
    }
  }
}
```

#### MapSelector Parameters

- **selector** (String!, required): CSS selector or JavaScript returning NodeList
  - CSS Examples: `".product"`, `"button"`, `"tr td"`
  - JavaScript Examples: `"document.querySelectorAll('.dynamic')"` 
  - Returns multiple elements for mapping

- **timeout** (Float, optional): Wait time for elements (default: 30000ms)
  - How long to wait for elements to appear
  - Useful for dynamically loaded content

- **wait** (Boolean, optional): Wait for elements in DOM (default: true)
  - `true`: Wait for elements to be present
  - `false`: Return immediately if elements not found

#### MapSelectorResponse Fields

- `innerHTML` - Inner HTML content of element
- `innerText` - Text content of element
- `outerHTML` - Full element HTML including tags
- `tagName` - HTML tag name of element
- `attributes` - Array of element attributes (name/value pairs)
- `mapSelector` - Nested mapSelector for hierarchical extraction

#### Data Extraction Use Cases

**🛒 E-commerce Product Listings**
```bql
# Extract product catalog data
products: mapSelector(selector: ".product-card") {
  title: innerText
  
  pricing: mapSelector(selector: ".price") {
    priceText: innerText
  }
  
  images: mapSelector(selector: "img") {
    attributes { name value }
  }
}
```

**📰 News & Article Extraction**
```bql
# Extract article content and metadata
articles: mapSelector(selector: ".article") {
  headline: innerText
  content: innerHTML
  
  authors: mapSelector(selector: ".author") {
    authorName: innerText
  }
}
```

**📊 Table & Structured Data**
```bql
# Extract table data with headers and cells
tableRows: mapSelector(selector: "tr") {
  rowContent: innerText
  
  cells: mapSelector(selector: "td") {
    cellText: innerText
    attributes { name value }
  }
}
```

**🔍 Search Results Processing**
```bql
# Extract search results with metadata
searchResults: mapSelector(selector: ".search-result", timeout: 10000) {
  title: innerText
  snippet: innerHTML
  
  links: mapSelector(selector: "a") {
    linkText: innerText
    attributes { name value }
  }
}
```

**📱 Social Media Content**
```bql
# Extract social media posts and interactions
posts: mapSelector(selector: ".post") {
  content: innerText
  
  reactions: mapSelector(selector: ".reaction") {
    reactionType: innerText
    reactionCount: innerHTML
  }
  
  media: mapSelector(selector: ".media img") {
    attributes { name value }
  }
}
```

#### Advanced Features

**🔄 JavaScript-based Selectors**
```bql
# Use JavaScript for dynamic element selection
dynamicElements: mapSelector(
  selector: "document.querySelectorAll('.dynamic-content')"
  timeout: 30000
) {
  content: innerText
  attributes { name value }
}
```

**🏗️ Deep Nesting (Multi-level Hierarchy)**
```bql
# Extract complex nested structures
complexData: mapSelector(selector: ".container") {
  level1: mapSelector(selector: ".level-1") {
    level2: mapSelector(selector: ".level-2") {
      level3: mapSelector(selector: ".level-3") {
        deepContent: innerText
        attributes { name value }
      }
    }
  }
}
```

**📝 Aliases for Better Data Structure**
```bql
# Use meaningful aliases for extracted data
productCatalog: mapSelector(selector: ".product") {
  productName: innerText
  productDescription: innerHTML
  
  productPricing: mapSelector(selector: ".price") {
    currentPrice: innerText
  }
  
  productAvailability: mapSelector(selector: ".stock") {
    stockStatus: innerText
  }
}
```

#### Best Practices

- **🎯 Specific Selectors**: Use precise CSS selectors for accurate targeting
- **📦 Meaningful Aliases**: Use descriptive field names for better data structure
- **⏱️ Timeout Management**: Set appropriate timeouts for dynamic content
- **🔄 Nested Mapping**: Leverage hierarchical extraction for complex data
- **📋 Attribute Extraction**: Use `attributes` for metadata and links
- **🚀 Performance**: Consider `wait: false` for immediate extraction when elements may not exist

#### Error Handling & Fallbacks

```bql
mutation RobustDataExtraction {
  # Primary data extraction
  primaryData: mapSelector(selector: ".primary-content", timeout: 10000) {
    content: innerText
  }
  
  # Fallback if primary content missing
  fallbackData: mapSelector(selector: ".fallback-content", wait: false) {
    content: innerText
  }
  
  # Always-present elements
  navigation: mapSelector(selector: "nav a") {
    linkText: innerText
    attributes { name value }
  }
}
```

MapSelector returns arrays of extracted data, making it perfect for processing product listings, search results, news articles, social media feeds, and any repetitive web content with consistent structure.

### JavaScript Control (javaScriptEnabled)

The extension provides full support for controlling JavaScript execution on web pages, based on the [official javaScriptEnabled documentation](https://docs.browserless.io/bql-schema/operations/mutations/java-script-enabled). This operation allows you to enable or disable JavaScript execution with effects taking place on the next navigation.

#### Basic JavaScript Control

```bql
mutation JavaScriptControl {
  # Get current JavaScript status
  status: javaScriptEnabled {
    enabled
  }

  # Disable JavaScript
  disable: javaScriptEnabled(enabled: false) {
    enabled
  }

  # Enable JavaScript  
  enable: javaScriptEnabled(enabled: true) {
    enabled
  }
  
  # Navigate to see the effect (required for changes to take effect)
  goto(url: "https://example.com") {
    status
    time
  }
}
```

#### Advanced JavaScript Control Workflows

```bql
mutation AdvancedJavaScriptWorkflow {
  # Security workflow - disable JavaScript for sensitive operations
  secureMode: javaScriptEnabled(enabled: false) {
    enabled
  }

  # Navigate to form without JavaScript interference
  secureForm: goto(url: "https://forms.example.com") {
    status
    time
  }

  # Fill sensitive data without JavaScript
  fillSecureData: type(
    selector: "input[name='sensitive']"
    text: "secure information"
  ) {
    time
  }

  # Take screenshot of secure state
  secureScreenshot: screenshot {
    base64
  }

  # Re-enable JavaScript for interactive features
  interactiveMode: javaScriptEnabled(enabled: true) {
    enabled
  }

  # Navigate to JavaScript-heavy application
  appPage: goto(url: "https://app.example.com") {
    status
    time
  }

  # Verify JavaScript is working
  jsTest: evaluate(content: `
    return {
      javascriptWorking: typeof window !== 'undefined',
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    };
  `) {
    value
  }
}
```

#### JavaScript Control Parameters

- **enabled** (Boolean, optional): Whether to enable JavaScript on the page
  - When omitted: Returns current JavaScript status
  - `true`: Enables JavaScript execution
  - `false`: Disables JavaScript execution

#### JavaScriptResponse Fields

- `enabled` - Boolean indicating current JavaScript execution status

#### Important Notes

- **⚠️ Navigation Required**: Changes only take effect on the next navigation operation
- **🔒 Security Applications**: Disable JavaScript for sensitive form operations
- **📊 Testing Applications**: Compare page behavior with/without JavaScript
- **🎯 Performance Testing**: Measure page load times without JavaScript overhead

#### Use Cases

- **🔒 Security Workflows**: Disable JavaScript for sensitive data entry
- **📊 Performance Analysis**: Compare load times with/without JavaScript
- **🧪 Feature Testing**: Test graceful degradation of JavaScript features
- **🔍 Content Analysis**: Extract static content without dynamic modifications
- **⚡ Speed Optimization**: Faster page loads by disabling JavaScript
- **🛡️ Security Auditing**: Test page functionality without JavaScript execution

#### Conditional JavaScript Control

```bql
mutation ConditionalJavaScriptControl {
  # Only enable JavaScript if page requires it
  if(selector: ".requires-javascript") {
    enableJS: javaScriptEnabled(enabled: true) {
      enabled
    }
    
    # Execute JavaScript-dependent operations
    jsFeature: evaluate(content: "window.myApp.initialize()") {
      value
    }
  }

  # Use fallback approach when JavaScript indicators are missing
  ifnot(selector: ".js-enabled-indicator") {
    disableJS: javaScriptEnabled(enabled: false) {
      enabled
    }
    
    # Extract static content
    staticContent: html {
      html
      time
    }
  }
}
```

### PDF Generation (pdf)

The extension provides comprehensive support for generating professional PDFs from web pages, based on the [official PDF documentation](https://docs.browserless.io/bql-schema/operations/mutations/pdf). This operation generates PDFs with the print CSS media type, supporting advanced formatting options, headers/footers, accessibility features, and professional document creation.

#### Basic PDF Generation

```bql
mutation BasicPDFGeneration {
  # Navigate to the page
  goto(url: "https://example.com", waitUntil: firstMeaningfulPaint) {
    status
    url
  }

  # Simple PDF generation
  simple: pdf {
    base64
  }

  # PDF with custom format
  a4Document: pdf(format: a4) {
    base64
  }

  # Landscape PDF for wide content
  landscape: pdf(
    format: a4
    landscape: true
    printBackground: true
  ) {
    base64
  }
}
```

#### Professional PDFs with Headers and Footers

```bql
mutation ProfessionalPDF {
  goto(url: "https://docs.example.com") {
    status
  }

  # Branded document with headers and footers
  brandedDocument: pdf(
    format: a4
    displayHeaderFooter: true
    headerTemplate: `
      <div style="font-size: 14pt; width: 100%; text-align: center; margin: 0 1cm; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
        <strong><span class="title"></span></strong> | Generated: <span class="date"></span>
      </div>
    `
    footerTemplate: `
      <div style="font-size: 10pt; width: 100%; text-align: center; margin: 0 1cm; border-top: 1px solid #ccc; padding-top: 5px;">
        <span class="url"></span> | Page <span class="pageNumber"></span>/<span class="totalPages"></span>
      </div>
    `
    printBackground: true
    marginTop: "2cm"
    marginBottom: "2cm"
    timeout: 45000
  ) {
    base64
  }
}
```

#### Advanced PDF Formatting

```bql
mutation AdvancedPDFFormatting {
  goto(url: "https://reports.example.com") {
    status
  }

  # Custom margins and scaling
  customFormatted: pdf(
    format: letter
    marginTop: "2.5cm"
    marginBottom: "2.5cm"
    marginLeft: "3cm"
    marginRight: "3cm"
    scale: 0.9
    printBackground: true
  ) {
    base64
  }

  # Large format poster
  poster: pdf(
    format: tabloid
    landscape: true
    scale: 1.2
    printBackground: true
    timeout: 60000
  ) {
    base64
  }

  # Accessible PDF with compliance features
  accessibleDocument: pdf(
    format: a4
    generateTaggedPDF: true
    generateDocumentOutline: true
    printBackground: true
    timeout: 90000
  ) {
    base64
  }
}
```

#### PDF Parameters

**Page Format Options:**
- `format` (PDFPageFormat, optional): Page format
  - `a0`, `a1`, `a2`, `a3`, `a4`, `a5`, `a6` - ISO A-series sizes
  - `letter` - US Letter (8.5" × 11")
  - `legal` - US Legal (8.5" × 14")
  - `tabloid` - Tabloid (11" × 17")
  - `ledger` - Ledger (17" × 11")

**Layout & Orientation:**
- `landscape` (Boolean, optional): Paper orientation (default: `false`)
- `width` (FloatOrString, optional): Width in inches or CSS unit (default: `"8.5"`)
- `height` (FloatOrString, optional): Height in inches or CSS unit (default: `"11"`)
- `preferCSSPageSize` (Boolean, optional): Use CSS-defined page size (default: `false`)

**Margins & Spacing:**
- `marginTop` (FloatOrString, optional): Top margin (default: `"1cm"`)
- `marginBottom` (FloatOrString, optional): Bottom margin (default: `"1cm"`)
- `marginLeft` (FloatOrString, optional): Left margin (default: `"1cm"`)
- `marginRight` (FloatOrString, optional): Right margin (default: `"1cm"`)

**Headers & Footers:**
- `displayHeaderFooter` (Boolean, optional): Show headers/footers (default: `false`)
- `headerTemplate` (String, optional): HTML template for header with special classes:
  - `date` - Formatted print date
  - `title` - Document title
  - `url` - Document location
  - `pageNumber` - Current page number
  - `totalPages` - Total pages in document
- `footerTemplate` (String, optional): HTML template for footer (same classes as header)

**Visual & Quality:**
- `printBackground` (Boolean, optional): Print background graphics (default: `false`)
- `scale` (Float, optional): Webpage rendering scale (default: `1`)

**Accessibility & Compliance:**
- `generateTaggedPDF` (Boolean, optional): Generate tagged (accessible) PDF
- `generateDocumentOutline` (Boolean, optional): Embed document outline

**Page Selection:**
- `pageRanges` (String, optional): Page ranges to print (e.g., `"1-5, 8, 11-13"`)

**Performance:**
- `timeout` (Float, optional): Generation timeout in milliseconds (default: `30000`)
- `transferMode` (String, optional): Return as stream

#### PDFResponse Fields

- `base64` - Base64 encoded PDF data ready for download or processing

#### Professional Use Cases

**📄 Invoice Generation**
```bql
mutation InvoiceGeneration {
  goto(url: "https://billing.example.com/invoice/123") {
    status
  }

  invoice: pdf(
    format: letter
    displayHeaderFooter: true
    headerTemplate: "<div style='font-size: 14pt; text-align: center; width: 100%; margin: 0 1cm;'>INVOICE</div>"
    footerTemplate: "<div style='font-size: 10pt; text-align: center; width: 100%; margin: 0 1cm;'>This is a computer-generated document</div>"
    printBackground: true
    marginTop: "2cm"
    marginBottom: "2cm"
    marginLeft: "2cm"
    marginRight: "2cm"
  ) {
    base64
  }
}
```

**📊 Report Export**
```bql
mutation ReportExport {
  goto(url: "https://analytics.example.com/monthly-report") {
    status
  }

  monthlyReport: pdf(
    format: a4
    landscape: true
    displayHeaderFooter: true
    headerTemplate: "<div style='font-size: 12pt; text-align: center; width: 100%;'>Monthly Analytics Report - <span class='date'></span></div>"
    printBackground: true
    scale: 0.8
    timeout: 60000
  ) {
    base64
  }
}
```

**♿ Accessible Documentation**
```bql
mutation AccessibleDocumentation {
  goto(url: "https://docs.example.com/user-guide") {
    status
  }

  userGuide: pdf(
    format: a4
    generateTaggedPDF: true
    generateDocumentOutline: true
    displayHeaderFooter: true
    headerTemplate: "<div style='font-size: 14pt; text-align: center; width: 100%;'>User Guide</div>"
    footerTemplate: "<div style='font-size: 10pt; text-align: center; width: 100%;'>Page <span class='pageNumber'></span></div>"
    printBackground: true
    preferCSSPageSize: true
    timeout: 90000
  ) {
    base64
  }
}
```

**🎨 Presentation Export**
```bql
mutation PresentationExport {
  goto(url: "https://slides.example.com/presentation") {
    status
  }

  presentation: pdf(
    format: tabloid
    landscape: true
    printBackground: true
    scale: 1.1
    marginTop: "0.5cm"
    marginBottom: "0.5cm"
    marginLeft: "0.5cm"
    marginRight: "0.5cm"
    timeout: 60000
  ) {
    base64
  }
}
```

#### Best Practices

- **📄 Format Selection**: Use `a4` for international documents, `letter` for US documents
- **🖨️ Print Backgrounds**: Enable `printBackground: true` for branded documents
- **📐 Margin Planning**: Use larger margins (`2cm+`) for formal documents requiring binding
- **⏱️ Timeout Management**: Set higher timeouts (`60000+ms`) for complex pages with images
- **♿ Accessibility**: Enable `generateTaggedPDF` and `generateDocumentOutline` for compliance
- **📄 Page Ranges**: Use `pageRanges` to extract specific sections from long documents
- **🔄 Scale Optimization**: Use `scale: 0.8-0.9` to fit more content per page
- **📱 Responsive PDFs**: Consider `preferCSSPageSize: true` for CSS-optimized layouts

#### Header/Footer Template Classes

Special CSS classes available in header and footer templates:

| Class | Description | Example |
|-------|-------------|---------|
| `date` | Formatted print date | `<span class="date"></span>` |
| `title` | Document title | `<span class="title"></span>` |
| `url` | Document URL | `<span class="url"></span>` |
| `pageNumber` | Current page number | `<span class="pageNumber"></span>` |
| `totalPages` | Total page count | `<span class="totalPages"></span>` |

#### Page Format Reference

| Format | Dimensions (mm) | Dimensions (in) | Use Case |
|--------|-----------------|-----------------|----------|
| A4 | 210 × 297 | 8.3" × 11.7" | International standard |
| Letter | 216 × 279 | 8.5" × 11" | US standard |
| Legal | 216 × 356 | 8.5" × 14" | US legal documents |
| A3 | 297 × 420 | 11.7" × 16.5" | Large format |
| Tabloid | 279 × 432 | 11" × 17" | Presentations |
| A5 | 148 × 210 | 5.8" × 8.3" | Compact documents |

#### Conditional PDF Generation

```bql
mutation ConditionalPDFGeneration {
  # Generate invoice PDF only if invoice data is present
  if(selector: ".invoice-data") {
    invoice: pdf(
      format: letter
      displayHeaderFooter: true
      headerTemplate: "<div style='text-align: center;'>INVOICE</div>"
      timeout: 30000
    ) {
      base64
    }
  }

  # Generate receipt PDF for completed orders
  if(selector: ".order-complete") {
    receipt: pdf(
      format: a4
      marginTop: "1cm"
      marginBottom: "1cm"
      printBackground: true
    ) {
      base64
    }
  }
}
```

The PDF operation provides enterprise-grade document generation capabilities with comprehensive formatting options, accessibility compliance, and professional output quality suitable for invoices, reports, documentation, and archival purposes.

### Session Configuration (preferences)

The extension provides comprehensive support for session-wide configuration management, based on the [official preferences documentation](https://docs.browserless.io/bql-schema/operations/mutations/preferences). This operation sets configuration defaults for the entire session, replacing built-in defaults like the 30-second timeout across all operations.

#### Basic Session Configuration

```bql
mutation BasicSessionConfig {
  # Get current session preferences (shows defaults)
  currentConfig: preferences {
    timeout
  }

  # Set new default timeout for all operations
  newConfig: preferences(timeout: 15000) {
    timeout
  }

  # All subsequent operations use the new 15-second default
  goto(url: "https://example.com") {
    status
    time
  }

  # Click operation uses the configured default timeout
  click(selector: "button") {
    selector
    time
  }
}
```

#### Adaptive Timeout Management

```bql
mutation AdaptiveSessionConfig {
  # Fast configuration for initial setup
  quickSetup: preferences(timeout: 5000) {
    timeout
  }

  # Quick operations with fast timeout
  homePage: goto(url: "https://fast-site.example.com") {
    status
    time
  }

  fastLogin: type(selector: "#username", text: "user123") {
    text
    time
  }

  # Switch to slower configuration for complex operations
  complexSetup: preferences(timeout: 60000) {
    timeout
  }

  # Complex operations with extended timeout
  dashboardPage: goto(url: "https://complex-dashboard.example.com") {
    status
    time
  }

  waitForDashboard: waitForSelector(selector: ".dashboard-ready") {
    success
  }
}
```

#### Environment-Based Configuration

```bql
mutation EnvironmentConfig {
  # Development environment - faster iteration
  if(selector: ".dev-environment") {
    devConfig: preferences(timeout: 10000) {
      timeout
    }
  }

  # Production environment - higher reliability
  ifnot(selector: ".dev-environment") {
    prodConfig: preferences(timeout: 90000) {
      timeout
    }
  }

  # Operations adapt to environment configuration
  goto(url: "https://app.example.com") {
    status
    time
  }

  # Critical operations benefit from environment-appropriate timeouts
  criticalAction: click(selector: ".important-button") {
    selector
    time
  }
}
```

#### Preferences Parameters

- **timeout** (Float, optional): Default timeout for all methods in milliseconds
  - Default value: `30000` (30 seconds)
  - Applies to: `goto`, `type`, `wait`, `click`, `waitForSelector`, and all other operations
  - Can be overridden per operation when needed
  - Range: `1000` - `300000` (1 second to 5 minutes) recommended

#### DefaultResponse Fields

- `timeout` - The configured default timeout value in milliseconds

#### Common Timeout Strategies

**⚡ Fast Operations (5-15 seconds)**
```bql
# Optimized for simple pages and quick interactions
fastConfig: preferences(timeout: 10000) {
  timeout
}
```

**🏢 Standard Operations (30-45 seconds)**
```bql
# Balanced configuration for most applications
standardConfig: preferences(timeout: 30000) {
  timeout
}
```

**🏗️ Complex Operations (60-120 seconds)**
```bql
# Extended timeouts for SPAs, heavy media, slow networks
complexConfig: preferences(timeout: 90000) {
  timeout
}
```

**🧪 Testing & Development (3-300 seconds)**
```bql
# Performance testing with minimal timeout
performanceTest: preferences(timeout: 3000) { timeout }

# Load testing with maximum timeout
loadTest: preferences(timeout: 300000) { timeout }
```

#### Use Cases and Benefits

**🎯 Session Optimization**
- Set appropriate defaults for your application's typical load times
- Reduce need to specify timeout on every operation
- Maintain consistent behavior across workflows

**📱 Device-Specific Configuration**
- Mobile devices: Longer timeouts for slower processing
- Desktop: Faster timeouts for powerful hardware
- Network conditions: Adaptive timeout based on connection speed

**🏭 Environment Management**
- Development: Fast timeouts for quick iteration
- Staging: Moderate timeouts for realistic testing
- Production: Conservative timeouts for reliability

**⚡ Performance Testing**
- Minimal timeouts to identify slow operations
- Maximum timeouts for stress testing
- Comparative analysis with different timeout values

#### Advanced Configuration Patterns

**🔄 Workflow-Based Timeouts**
```bql
mutation WorkflowTimeouts {
  # Login phase - fast operations
  loginPhase: preferences(timeout: 8000) {
    timeout
  }

  # Authentication operations
  login: goto(url: "https://auth.example.com") {
    status
  }

  # Dashboard phase - complex operations
  dashboardPhase: preferences(timeout: 45000) {
    timeout
  }

  # Heavy dashboard loading
  dashboard: goto(url: "https://dashboard.example.com") {
    status
  }

  # Cleanup phase - standard operations
  cleanupPhase: preferences(timeout: 20000) {
    timeout
  }
}
```

**🌐 Network-Aware Configuration**
```bql
mutation NetworkAwareConfig {
  # Detect network conditions and adapt
  if(selector: ".slow-network-indicator") {
    slowNetwork: preferences(timeout: 180000) {
      timeout
    }
  }

  if(selector: ".fast-network-indicator") {
    fastNetwork: preferences(timeout: 8000) {
      timeout
    }
  }

  # Operations automatically use appropriate timeout
  goto(url: "https://adaptive-site.example.com") {
    status
    time
  }
}
```

**🔧 Override When Needed**
```bql
mutation MixedTimeouts {
  # Set reasonable default
  standardConfig: preferences(timeout: 20000) {
    timeout
  }

  # Most operations use the default
  standardOp: goto(url: "https://example.com") {
    status
  }

  # Override for specific slow operation
  slowOp: waitForSelector(selector: ".slow-element", timeout: 120000) {
    success
  }

  # Override for specific fast operation
  fastOp: type(selector: "#quick-input", text: "fast", timeout: 3000) {
    text
  }

  # Back to using default
  normalOp: click(selector: "button") {
    selector
  }
}
```

#### Best Practices

- **🎯 Set Appropriate Defaults**: Choose timeout values that match your application's typical behavior
- **📊 Monitor Performance**: Track operation completion times to optimize timeout values
- **🔄 Adapt to Context**: Use different timeouts for different phases of your workflow
- **⚖️ Balance Speed vs Reliability**: Faster timeouts improve performance but may cause failures on slower systems
- **🧪 Test Edge Cases**: Verify behavior with both minimum and maximum timeout values
- **📝 Document Timeouts**: Clearly document timeout strategies for team understanding

#### Common Timeout Values by Use Case

| Use Case | Recommended Timeout | Reasoning |
|----------|-------------------|-----------|
| API Testing | 5-10 seconds | Fast feedback, simple requests |
| E-commerce | 30-45 seconds | Product images, checkout processes |
| Social Media | 15-30 seconds | Dynamic content, media loading |
| Business Apps | 45-90 seconds | Complex data, reports, dashboards |
| Media Sites | 60-120 seconds | Large images, videos, rich content |
| Mobile Testing | 45-90 seconds | Slower processing, network variability |

#### Error Recovery with Preferences

```bql
mutation ErrorRecovery {
  # Aggressive timeout for performance testing
  aggressiveTest: preferences(timeout: 2000) {
    timeout
  }

  # This may timeout (intended for testing)
  fastTest: goto(url: "https://potentially-slow.example.com") {
    status
  }

  # Reset to conservative timeout for recovery
  recoveryConfig: preferences(timeout: 60000) {
    timeout
  }

  # Reliable recovery operation
  recovery: goto(url: "https://reliable-site.example.com") {
    status
    time
  }
}
```

The preferences operation provides essential session management capabilities, enabling you to optimize timeout behavior for your specific use case, environment, and performance requirements while maintaining the flexibility to override defaults when needed.

### Proxy Configuration (proxy)

The extension provides comprehensive support for advanced proxy configuration, based on the [official proxy documentation](https://docs.browserless.io/bql-schema/operations/mutations/proxy). This operation enables sophisticated request routing through either Browserless residential proxies or external proxy servers with advanced filtering and geographic targeting capabilities.

#### Basic Proxy Configuration

```bql
mutation BasicProxySetup {
  # Route all requests through Brazil using Browserless residential proxy
  brazilProxy: proxy(
    url: ["*"]
    country: BR
  ) {
    time
  }

  # Navigate using the configured proxy
  goto(url: "https://example.com") {
    status
    url
  }

  # Use external proxy server with authentication
  externalProxy: proxy(
    url: ["*"]
    server: "http://username:password@my-proxy.com:12321"
  ) {
    time
  }
}
```

#### Advanced Geographic Targeting

```bql
mutation GeoTargetedProxy {
  # Precise location targeting with sticky sessions
  locationProxy: proxy(
    url: ["*"]
    country: US
    state: "california"
    city: "losangeles"
    sticky: true
  ) {
    time
  }

  # Multi-region proxy configuration
  europeProxy: proxy(
    url: ["https://eu.example.com/*"]
    country: DE
    state: "bavaria"
    city: "munich"
  ) {
    time
  }

  # Navigate using location-specific proxy
  goto(url: "https://geo-restricted-site.example.com") {
    status
    url
  }
}
```

#### Resource and Method Filtering

```bql
mutation FilteredProxyConfig {
  # Proxy only API requests through Germany
  apiProxy: proxy(
    url: ["https://api.example.com/*"]
    method: [GET, POST, PUT]
    type: [xhr, fetch]
    country: DE
    operator: and
  ) {
    time
  }

  # Proxy only document requests through France
  documentProxy: proxy(
    url: ["*"]
    type: [document]
    country: FR
  ) {
    time
  }

  # Proxy images and media through UK
  mediaProxy: proxy(
    url: ["*.jpg", "*.png", "*.mp4"]
    type: [image, media]
    country: GB
  ) {
    time
  }
}
```

#### Security and Enterprise Configuration

```bql
mutation SecureProxySetup {
  # High-security external proxy for sensitive operations
  secureProxy: proxy(
    url: ["https://secure-api.example.com/*", "https://banking.example.com/*"]
    method: [POST, PUT, DELETE]
    server: "https://secure-user:complex-password@enterprise-proxy.com:8443"
    operator: and
  ) {
    time
  }

  # Swiss residential proxy for privacy-sensitive operations
  privacyProxy: proxy(
    url: ["https://sensitive.example.com/*"]
    country: CH
    sticky: true
  ) {
    time
  }
}
```

#### Proxy Parameters

**Geographic Targeting (Browserless Residential Proxy):**
- **country** (CountryType, optional): Target country using ISO country codes (US, GB, FR, DE, etc.)
- **state** (String, optional): Target state/province (lowercase, no spaces: "california", "newyork")
- **city** (String, optional): Target city (lowercase, no spaces: "losangeles", "newyorkcity")
- **sticky** (Boolean, optional): Use same IP for subsequent matching requests

**External Proxy Configuration:**
- **server** (String, optional): External proxy URL with authentication (`http://user:pass@proxy.com:port`)
  - Supports HTTP and HTTPS proxies
  - Basic authentication included in URL
  - Cannot be used with geographic targeting parameters

**Request Filtering:**
- **url** ([String], optional): Glob-style URL patterns to match (`["*"]`, `["https://api.example.com/*"]`)
- **method** ([Method], optional): HTTP methods to proxy (`[GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS]`)
- **type** ([ResourceType], optional): Resource types to proxy:
  - `document` - HTML documents and main page requests
  - `xhr` - XMLHttpRequest AJAX calls
  - `fetch` - Fetch API requests
  - `stylesheet` - CSS files
  - `script` - JavaScript files
  - `image` - Images (PNG, JPEG, GIF, SVG)
  - `media` - Audio and video files
  - `font` - Web fonts
  - `websocket` - WebSocket connections
  - `other` - Other resource types

**Logic Configuration:**
- **operator** (OperatorTypes, optional): Condition matching logic (default: `or`)
  - `or` - Any condition match triggers proxy usage
  - `and` - All conditions must match to trigger proxy usage

#### ProxyResponse Fields

- `time` - Time elapsed in milliseconds for setting up the proxy configuration

#### Use Cases and Benefits

**🌍 Geographic Testing**
- Test geo-restricted content and region-specific features
- Verify international compliance (GDPR, regional laws)
- Performance testing from different global locations
- Localization and regional content validation

**🔒 Security and Privacy**
- Route sensitive operations through secure proxy networks
- Protect source IP address for reconnaissance activities
- Comply with enterprise security policies
- Anonymous testing and data collection

**⚡ Performance Optimization**
- Route requests through geographically optimal proxy locations
- Reduce latency by selecting proxies close to target servers
- Load balancing across multiple proxy locations
- CDN-aware routing for static assets

**🧪 Testing and Development**
- Simulate user behavior from different countries
- Test API rate limiting and geographic restrictions
- Validate content delivery and caching strategies
- Cross-border data flow testing

#### Advanced Configuration Patterns

**🎯 Multi-Tier Proxy Strategy**
```bql
mutation MultiTierProxy {
  # Primary API proxy through US East Coast
  primaryAPI: proxy(
    url: ["https://api.example.com/*"]
    method: [GET, POST]
    type: [xhr, fetch]
    country: US
    state: "virginia"
    city: "ashburn"
    sticky: true
    operator: and
  ) {
    time
  }

  # Secondary API proxy through US West Coast
  secondaryAPI: proxy(
    url: ["https://backup-api.example.com/*"]
    method: [GET, POST]
    type: [xhr, fetch]
    country: US
    state: "california"
    city: "sanfrancisco"
    operator: and
  ) {
    time
  }

  # Static assets through CDN-optimized locations
  staticAssets: proxy(
    url: ["*.css", "*.js", "*.png", "*.jpg"]
    type: [stylesheet, script, image]
    country: US
    city: "ashburn"
  ) {
    time
  }
}
```

**🔄 Conditional Proxy Configuration**
```bql
mutation ConditionalProxy {
  # API proxy for detected JSON endpoints
  if(selector: "[content-type*='json']") {
    apiProxy: proxy(
      url: ["*"]
      type: [xhr, fetch]
      method: [GET, POST, PUT]
      country: US
      operator: and
    ) {
      time
    }
  }

  # General proxy for regular web content
  ifnot(selector: "[content-type*='json']") {
    webProxy: proxy(
      url: ["*"]
      type: [document, stylesheet, script, image]
      country: GB
    ) {
      time
    }
  }
}
```

**🌐 International Compliance Strategy**
```bql
mutation ComplianceProxy {
  # EU proxy for GDPR-sensitive operations
  euProxy: proxy(
    url: ["https://eu-api.example.com/*", "https://gdpr.example.com/*"]
    method: [GET, POST, PUT, DELETE]
    country: DE
    operator: and
  ) {
    time
  }

  # Canadian proxy for PIPEDA compliance
  canadaProxy: proxy(
    url: ["https://ca-api.example.com/*"]
    country: CA
    state: "ontario"
    city: "toronto"
  ) {
    time
  }

  # Swiss proxy for maximum privacy
  privacyProxy: proxy(
    url: ["https://private.example.com/*"]
    country: CH
    sticky: true
  ) {
    time
  }
}
```

#### Best Practices

- **🎯 Specific URL Patterns**: Use precise URL patterns instead of wildcards when possible
- **🔒 Security First**: Use external proxies for sensitive operations requiring specific security standards
- **📍 Geographic Optimization**: Choose proxy locations close to target servers for optimal performance
- **🔄 Sticky Sessions**: Enable sticky sessions for applications requiring session consistency
- **⚖️ Logical Operators**: Use `and` operator for strict filtering, `or` for flexible matching
- **📊 Performance Monitoring**: Track proxy setup times and adjust configurations based on performance metrics

#### Common Configuration Examples

**E-commerce Testing**
```bql
# Multi-region e-commerce proxy setup
ecommerceProxy: proxy(
  url: ["https://shop.example.com/*", "https://checkout.example.com/*"]
  method: [GET, POST, PUT]
  type: [document, xhr, fetch]
  country: US
  state: "california"
  sticky: true
  operator: and
) { time }
```

**API Load Testing**
```bql
# Load testing with distributed proxy locations
loadTestProxy: proxy(
  url: ["https://api.example.com/*"]
  method: [GET, POST]
  type: [xhr, fetch]
  country: US
  sticky: false  # Distribute across multiple IPs
) { time }
```

**Security Testing**
```bql
# Anonymous security testing proxy
securityProxy: proxy(
  url: ["https://target.example.com/*"]
  server: "socks5://anonymous-user:pass@security-proxy.com:1080"
) { time }
```

#### Geographic Coverage

The proxy operation supports **200+ countries** with detailed targeting options:

| Region | Popular Countries | State/City Support |
|--------|------------------|-------------------|
| North America | US, CA, MX | Full state/city targeting |
| Europe | GB, DE, FR, IT, ES, NL | Limited city targeting |
| Asia Pacific | JP, AU, SG, HK, IN, KR | Major cities available |
| South America | BR, AR, CL, CO | Limited targeting |
| Middle East/Africa | AE, ZA, IL, EG | Major cities only |

#### Error Handling and Troubleshooting

```bql
mutation ProxyErrorHandling {
  # Test proxy connectivity
  testProxy: proxy(
    url: ["https://httpbin.org/ip"]
    country: US
  ) {
    time
  }

  # Verify proxy is working
  ipCheck: goto(url: "https://httpbin.org/ip") {
    status
    time
  }

  # Get response to verify IP change
  ipResponse: text(selector: "body") {
    text
    time
  }
}
```

#### Performance Considerations

- **Setup Time**: Proxy configuration adds 100-500ms setup time
- **Request Latency**: Additional 20-200ms per request depending on proxy location
- **Throughput**: Residential proxies may have lower throughput than direct connections
- **Sticky Sessions**: Reduce setup overhead for subsequent requests
- **Geographic Distance**: Choose proxy locations close to target servers

The proxy operation provides enterprise-grade request routing capabilities with comprehensive filtering, geographic targeting, and security features suitable for testing, compliance, performance optimization, and security applications.

### DOM Query Operations

#### querySelector
The extension provides comprehensive support for single DOM element querying, based on the [official querySelector documentation](https://docs.browserless.io/bql-schema/operations/mutations/query-selector). This operation passes through the browser's native `document.querySelector` API, returning detailed information about the first DOM element that matches a CSS selector.

**Basic Usage:**
```bql
mutation QuerySelector {
  # Get first heading element
  mainHeading: querySelector(selector: "h1") {
    innerHTML
    innerText
    tagName
  }

  # Get first link with href attribute
  primaryLink: querySelector(selector: "a[href]") {
    innerText
    attributes {
      name
      value
    }
  }

  # Get specific element by ID
  mainContent: querySelector(selector: "#main-content") {
    innerHTML
    tagName
    attributes {
      name
      value
    }
  }
}
```

**Advanced Selectors:**
```bql
mutation AdvancedQuerySelector {
  # Complex attribute selectors
  submitButton: querySelector(selector: "button[type='submit'].primary") {
    innerHTML
    tagName
    attributes {
      name
      value
    }
  }

  # Data attribute selectors
  productCard: querySelector(selector: "[data-product-id]") {
    innerHTML
    tagName
    attributes {
      name
      value
    }
  }

  # Multiple selector options (first match wins)
  navigation: querySelector(selector: "nav.main, nav[role='navigation'], .main-nav") {
    innerHTML
    tagName
    attributes {
      name
      value
    }
  }
}
```

**Visibility and Timeout Options:**
```bql
mutation VisibilityQuerySelector {
  # Wait for visible element
  dynamicContent: querySelector(
    selector: ".dynamic-content"
    visible: true
    timeout: 5000
  ) {
    innerHTML
    innerText
    tagName
    attributes {
      name
      value
    }
  }

  # Quick element check
  quickElement: querySelector(
    selector: ".instant-element"
    timeout: 1000
  ) {
    tagName
    innerHTML
  }
}
```

**Parameters:**
- `selector` (String!, required): CSS selector string to match a single element
- `timeout` (Float, optional): Maximum wait time in milliseconds for element to appear
- `visible` (Boolean, optional): Only return element if it is visible (default: false)

**Response Fields:**
- `innerHTML`: Inner HTML content of the element
- `innerText`: Text content of the element
- `outerHTML`: Outer HTML including the element tags
- `tagName`: HTML tag name of the element
- `attributes`: Array of element attributes with name and value pairs

#### querySelectorAll
The extension provides comprehensive support for multiple DOM element querying, based on the [official querySelectorAll documentation](https://docs.browserless.io/bql-schema/operations/mutations/query-selector-all). This operation passes through the browser's native `document.querySelectorAll` API, returning detailed information about multiple DOM elements that match a CSS selector.

#### Basic Element Querying

```bql
mutation BasicDOMQuerying {
  goto(url: "https://example.com") {
    status
  }

  # Get all headings
  headlines: querySelectorAll(selector: "h1, h2, h3") {
    innerHTML
    innerText
    tagName
  }

  # Get all links with their attributes
  links: querySelectorAll(selector: "a") {
    innerHTML
    innerText
    attributes {
      name
      value
    }
  }

  # Get all images
  images: querySelectorAll(selector: "img") {
    tagName
    outerHTML
    attributes {
      name
      value
    }
  }
}
```

#### Advanced Selector Patterns

```bql
mutation AdvancedSelectors {
  goto(url: "https://example.com") {
    status
  }

  # Complex descendant selectors
  nestedElements: querySelectorAll(selector: ".container .content .item") {
    innerHTML
    innerText
    tagName
  }

  # Attribute selectors with operators
  attributeElements: querySelectorAll(selector: "a[href^='https'], img[src*='cdn'], input[name$='_id']") {
    tagName
    attributes {
      name
      value
    }
  }

  # Pseudo-class selectors
  interactiveElements: querySelectorAll(selector: "input:checked, option:selected, a:not([href])") {
    tagName
    attributes {
      name
      value
    }
  }
}
```

#### Visibility and Timeout Controls

```bql
mutation VisibilityControls {
  goto(url: "https://dynamic-site.example.com") {
    status
  }

  # Get only visible elements
  visibleElements: querySelectorAll(
    selector: ".dynamic-content"
    visible: true
  ) {
    innerHTML
    innerText
    tagName
  }

  # Wait for elements to appear with timeout
  delayedElements: querySelectorAll(
    selector: ".loaded-content"
    timeout: 10000
    visible: true
  ) {
    innerHTML
    tagName
    attributes {
      name
      value
    }
  }
}
```

#### QuerySelectorAll Parameters

- **selector** (String!, required): CSS selector string to query multiple elements
  - Supports all CSS selector syntax: classes (`.class`), IDs (`#id`), attributes (`[attr]`), pseudo-classes (`:hover`)
  - Complex selectors: descendant (` `), child (`>`), adjacent sibling (`+`), general sibling (`~`)
  - Attribute operators: `[attr^="prefix"]`, `[attr$="suffix"]`, `[attr*="contains"]`, `[attr="exact"]`

- **timeout** (Float, optional): Maximum wait time in milliseconds for elements to appear
  - Default behavior: No explicit timeout (uses session default)
  - Useful for dynamically loaded content
  - Range: `1000` - `60000` milliseconds recommended

- **visible** (Boolean, optional): Only return visible elements (default: `false`)
  - `true` - Filter out hidden elements (display: none, visibility: hidden, etc.)
  - `false` - Return all matching elements regardless of visibility
  - Useful for testing visible UI components

#### QuerySelectorResponse Fields

Each element in the returned array includes:

- **innerHTML** - Inner HTML content of the element
- **innerText** - Text content of the element (rendered text only)
- **outerHTML** - Complete element HTML including the element tags
- **tagName** - HTML tag name of the element (uppercase)
- **attributes** - Array of element attributes with name and value pairs

#### Common Use Cases

**🔍 Content Analysis**
```bql
# Analyze page structure and content
pageAnalysis: querySelectorAll(selector: "h1, h2, h3, h4, h5, h6") {
  innerText
  tagName
}

textContent: querySelectorAll(selector: "p, span, div") {
  innerText
  tagName
}
```

**🔗 Link Extraction**
```bql
# Extract all navigation links
navigation: querySelectorAll(selector: "nav a, .nav a, [role='navigation'] a") {
  innerText
  attributes {
    name
    value
  }
}

# Get external links
externalLinks: querySelectorAll(selector: "a[href^='http']") {
  innerText
  attributes {
    name
    value
  }
}
```

**📋 Form Analysis**
```bql
# Get all form elements
formElements: querySelectorAll(selector: "input, textarea, select, button") {
  tagName
  attributes {
    name
    value
  }
}

# Get only visible form inputs
visibleInputs: querySelectorAll(
  selector: "input, textarea, select"
  visible: true
) {
  tagName
  attributes {
    name
    value
  }
}
```

**🖼️ Media Element Extraction**
```bql
# Get all images with attributes
images: querySelectorAll(selector: "img") {
  attributes {
    name
    value
  }
}

# Get video elements
videos: querySelectorAll(selector: "video") {
  tagName
  outerHTML
  attributes {
    name
    value
  }
}
```

**📊 Table Data Extraction**
```bql
# Extract table structure
tableHeaders: querySelectorAll(selector: "th") {
  innerText
  innerHTML
  tagName
}

tableCells: querySelectorAll(selector: "td") {
  innerText
  innerHTML
  tagName
}
```

#### Advanced Patterns

**🎯 Data Attribute Targeting**
```bql
mutation DataAttributeQuerying {
  goto(url: "https://modern-app.example.com") {
    status
  }

  # Get elements with specific data attributes
  dataElements: querySelectorAll(selector: "[data-id], [data-value], [data-type]") {
    tagName
    innerHTML
    attributes {
      name
      value
    }
  }

  # Target specific data values
  specificData: querySelectorAll(selector: "[data-role='button'], [data-type='primary']") {
    tagName
    innerText
    attributes {
      name
      value
    }
  }
}
```

**🏗️ Complex Structure Analysis**
```bql
mutation StructureAnalysis {
  goto(url: "https://complex-site.example.com") {
    status
  }

  # Analyze semantic structure
  semanticElements: querySelectorAll(selector: "main, article, section, aside, header, footer") {
    tagName
    attributes {
      name
      value
    }
  }

  # Get interactive elements
  interactive: querySelectorAll(
    selector: "a, button, input, select, textarea, [tabindex], [onclick], [role='button']"
    visible: true
  ) {
    tagName
    innerText
    attributes {
      name
      value
    }
  }
}
```

**🛒 E-commerce Element Extraction**
```bql
mutation EcommerceAnalysis {
  goto(url: "https://shop.example.com") {
    status
  }

  # Product elements
  products: querySelectorAll(
    selector: ".product, .item, [data-product]"
    visible: true
  ) {
    innerHTML
    tagName
    attributes {
      name
      value
    }
  }

  # Price information
  prices: querySelectorAll(selector: ".price, .cost, [data-price], .amount") {
    innerText
    tagName
  }

  # Action buttons
  actionButtons: querySelectorAll(
    selector: ".add-to-cart, .buy-now, [data-action='purchase']"
    visible: true
  ) {
    innerHTML
    innerText
    attributes {
      name
      value
    }
  }
}
```

#### Performance and Best Practices

- **🎯 Specific Selectors**: Use precise selectors to reduce processing time and improve results
- **👁️ Visibility Filtering**: Use `visible: true` when analyzing user-facing content
- **⏱️ Appropriate Timeouts**: Set timeouts based on expected content loading times
- **📊 Batch Operations**: Combine multiple element types in single selectors when appropriate
- **🔍 Progressive Refinement**: Start with broad selectors, then refine based on results

#### Selector Performance Guide

| Selector Type | Performance | Use Case |
|---------------|-------------|----------|
| ID (`#id`) | Fastest | Single element (consider `querySelector`) |
| Class (`.class`) | Fast | Multiple similar elements |
| Tag (`div`) | Moderate | All elements of specific type |
| Attribute (`[attr]`) | Moderate | Elements with specific attributes |
| Complex (`.a .b .c`) | Slower | Specific nested structures |
| Pseudo (`:nth-child`) | Slowest | Complex positioning rules |

#### Error Handling

```bql
mutation ErrorHandling {
  goto(url: "https://example.com") {
    status
  }

  # Non-existent elements return empty array
  missing: querySelectorAll(selector: ".does-not-exist") {
    innerHTML
    tagName
  }

  # Short timeout for quick failure
  quickCheck: querySelectorAll(
    selector: ".might-not-exist"
    timeout: 1000
  ) {
    innerHTML
    tagName
  }
}
```

#### Comparison with mapSelector

| Feature | querySelectorAll | mapSelector |
|---------|------------------|-------------|
| **Purpose** | Direct DOM querying | Structured data extraction |
| **Returns** | Element properties | Customizable data structure |
| **Nesting** | Not supported | Full nested mapping |
| **Performance** | Faster for simple queries | Better for complex extraction |
| **Use Case** | Element analysis, testing | Data scraping, content extraction |

The querySelectorAll operation provides essential DOM querying capabilities with comprehensive element analysis, making it perfect for testing, content analysis, form validation, and structural page examination.

### Session Management (reconnect)

The extension provides comprehensive support for browser session continuity through the `reconnect` operation, based on the [official reconnect documentation](https://docs.browserless.io/bql-schema/operations/mutations/reconnect). This operation returns reconnection information to maintain browser session continuity across different contexts.

#### Basic Session Reconnection

```bql
mutation BasicReconnect {
  # Establish initial session
  goto(url: "https://example.com") {
    status
    url
  }

  # Get reconnection information with default timeout (30 seconds)
  sessionInfo: reconnect {
    browserQLEndpoint
    browserWSEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }
}
```

#### Development and Debugging Sessions

```bql
mutation DevelopmentReconnect {
  # Extended timeout for development work (2 minutes)
  devSession: reconnect(timeout: 120000) {
    browserQLEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }

  # Debug session with maximum timeout (10 minutes)
  debugSession: reconnect(timeout: 600000) {
    browserQLEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }
}
```

#### Production and Automation Sessions

```bql
mutation ProductionReconnect {
  # Production session with balanced timeout (45 seconds)
  prodSession: reconnect(timeout: 45000) {
    browserQLEndpoint
    browserWSEndpoint
  }

  # Long-running automation session (5 minutes)
  automationSession: reconnect(timeout: 300000) {
    browserQLEndpoint
    browserWSEndpoint
  }

  # CI/CD pipeline session (3 minutes)
  cicdSession: reconnect(timeout: 180000) {
    browserQLEndpoint
    browserWSEndpoint
  }
}
```

#### Testing and Quality Assurance Sessions

```bql
mutation TestingReconnect {
  # Load testing session (1.5 minutes)
  loadTest: reconnect(timeout: 90000) {
    browserQLEndpoint
    browserWSEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }

  # End-to-end testing session (15 minutes)
  e2eTest: reconnect(timeout: 900000) {
    browserQLEndpoint
    browserWSEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }

  # Performance monitoring session (30 minutes)
  perfMonitor: reconnect(timeout: 1800000) {
    browserQLEndpoint
    browserWSEndpoint
  }
}
```

#### Advanced Session Management

```bql
mutation AdvancedReconnect {
  # Quick operation session (10 seconds)
  quickOps: reconnect(timeout: 10000) {
    browserQLEndpoint
    browserWSEndpoint
  }

  # Extended workflow session (12 minutes)
  extendedWorkflow: reconnect(timeout: 720000) {
    browserQLEndpoint
    browserWSEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }

  # Backup session for failover (20 minutes)
  backupSession: reconnect(timeout: 1200000) {
    browserQLEndpoint
    browserWSEndpoint
  }
}
```

#### Reconnect Parameters

- **timeout** (Float, optional): Time in milliseconds to keep browser session alive without connection (default: 30000)

#### ReconnectionResponse Fields

- **browserQLEndpoint**: GraphQL endpoint URL for BrowserQL operations
- **browserWSEndpoint**: WebSocket endpoint URL for real-time browser connection  
- **devtoolsFrontendUrl**: Chrome DevTools frontend URL for debugging interface
- **webSocketDebuggerUrl**: WebSocket debugger URL for Chrome DevTools protocol

#### Session Management Benefits

- **🔄 Session Continuity**: Maintain browser state across disconnections
- **🛠️ Development Tools**: Access to Chrome DevTools for debugging
- **📡 Real-time Connection**: WebSocket endpoints for live browser interaction
- **⚡ Flexible Timeouts**: Customizable session duration based on use case
- **🔌 Easy Reconnection**: Simple endpoint URLs for session restoration
- **🏗️ Multi-context Support**: GraphQL and WebSocket endpoints for different integration patterns

#### Common Timeout Strategies

| Use Case | Timeout | Description |
|----------|---------|-------------|
| **Quick Operations** | 10-15 seconds | Simple interactions, form submissions |
| **Standard Workflows** | 30-60 seconds | Regular automation tasks |
| **Development** | 2-5 minutes | Interactive development and testing |
| **Long Automation** | 5-10 minutes | Complex multi-step processes |
| **Load Testing** | 10-30 minutes | Performance and stress testing |
| **Extended Sessions** | 30+ minutes | Monitoring, demos, workshops |

The reconnect operation provides essential session management capabilities for maintaining browser continuity, enabling debugging workflows, and supporting various automation and testing scenarios with flexible timeout configurations.

### Request Filtering (reject)

The extension provides comprehensive support for request filtering through the `reject` operation, based on the [official reject documentation](https://docs.browserless.io/bql-schema/operations/mutations/reject). This operation blocks requests by URL patterns, HTTP methods, or resource types using logical operators, enabling performance optimization, security enhancement, and selective content loading.

#### Basic Request Rejection

```bql
mutation BasicReject {
  # Block all images and media files
  blockMedia: reject(type: [image, media]) {
    enabled
    time
  }

  # Block tracking scripts
  blockTracking: reject(
    url: [
      "*google-analytics.com*",
      "*facebook.com/tr*",
      "*ads*"
    ]
  ) {
    enabled
    time
  }

  # Navigate with filtering active
  goto(url: "https://cnn.com", waitUntil: firstMeaningfulPaint) {
    status
    time
  }
}
```

#### Advanced Logical Operators

```bql
mutation LogicalOperators {
  # OR operator (default): reject if ANY condition matches
  rejectTrackingOR: reject(
    url: ["*analytics*", "*tracking*", "*ads*"]
    operator: or
  ) {
    enabled
    time
  }

  # AND operator: reject only if ALL conditions match
  rejectGoogleImagesAND: reject(
    operator: and
    type: [image]
    url: ["*google.com*"]
  ) {
    enabled
    time
  }
}
```

#### Performance Optimization

```bql
mutation PerformanceReject {
  # Block heavy media files for faster loading
  blockHeavyAssets: reject(
    type: [image, media, font]
    url: ["*.jpg", "*.png", "*.mp4", "*.woff*"]
    operator: or
  ) {
    enabled
    time
  }

  # Block external CDN resources
  blockCDNs: reject(
    url: ["*cdn*", "*amazonaws.com*", "*cloudfront.net*"]
    operator: or
  ) {
    enabled
    time
  }

  # Block JavaScript and CSS for text-only browsing
  blockAssets: reject(type: [script, stylesheet]) {
    enabled
    time
  }
}
```

#### Security and Privacy

```bql
mutation SecurityReject {
  # Block malicious content patterns
  blockMalware: reject(
    url: [
      "*malware*",
      "*phishing*",
      "*.exe",
      "*.bat",
      "*suspicious*"
    ]
    operator: or
  ) {
    enabled
    time
  }

  # Block social media tracking
  blockSocialTracking: reject(
    url: [
      "*facebook.com/tr*",
      "*twitter.com/i/adsct*",
      "*linkedin.com/li*"
    ]
    operator: or
  ) {
    enabled
    time
  }

  # Block cryptocurrency mining scripts
  blockCryptoMining: reject(
    url: [
      "*coinhive*",
      "*jsecoin*",
      "*cryptoloot*"
    ]
    operator: or
  ) {
    enabled
    time
  }
}
```

#### API and Method Filtering

```bql
mutation APIReject {
  # Block API write operations
  blockAPIWrites: reject(
    method: [POST, PUT, DELETE, PATCH]
    url: ["*/api/*", "*/v1/*", "*/graphql*"]
    operator: or
  ) {
    enabled
    time
  }

  # Block sensitive endpoints with specific methods
  blockSensitiveAPIs: reject(
    method: [DELETE, POST]
    url: ["*/admin/*", "*/users/*", "*/settings/*"]
    operator: and
  ) {
    enabled
    time
  }

  # Block external API calls
  blockExternalAPIs: reject(
    type: [xhr, fetch]
    url: ["https://*", "http://*"]
    operator: and
  ) {
    enabled
    time
  }
}
```

#### Dynamic Filter Management

```bql
mutation DynamicReject {
  # Enable filtering for initial navigation
  enableFilters: reject(
    type: [image, media]
    url: ["*ads*", "*tracking*"]
    operator: or
  ) {
    enabled
    time
  }

  # Navigate with filters active
  goto(url: "https://example.com") {
    status
  }

  # Disable all filters
  disableFilters: reject(enabled: false) {
    enabled
    time
  }

  # Re-enable with different patterns
  enableMinimal: reject(
    enabled: true
    url: ["*ads*"]
  ) {
    enabled
    time
  }
}
```

#### Comprehensive Filtering Strategies

```bql
mutation ComprehensiveReject {
  # Ad blocking strategy
  adBlock: reject(
    url: [
      "*ads*",
      "*doubleclick*",
      "*googlesyndication*",
      "*amazon-adsystem*"
    ]
    operator: or
  ) {
    enabled
    time
  }

  # Analytics blocking strategy
  analyticsBlock: reject(
    url: [
      "*google-analytics*",
      "*hotjar*",
      "*mixpanel*",
      "*segment*"
    ]
    operator: or
  ) {
    enabled
    time
  }

  # Chat widget blocking
  chatBlock: reject(
    url: [
      "*intercom*",
      "*zendesk*",
      "*drift*",
      "*livechat*"
    ]
    operator: or
  ) {
    enabled
    time
  }
}
```

#### Reject Parameters

- **enabled** (Boolean, optional): Whether to enable request rejections (default: true)
- **method** ([Method], optional): HTTP methods to reject (GET, POST, PUT, DELETE, PATCH, etc.)
- **operator** (OperatorTypes, optional): Logical operator for conditions - "or" (any match) or "and" (all must match) (default: or)
- **type** ([ResourceType], optional): Resource types to reject (image, media, script, stylesheet, xhr, fetch, etc.)
- **url** ([String], optional): Glob-style URL patterns to reject

#### RejectResponse Fields

- **enabled**: Whether request rejection is currently active
- **time**: Time elapsed in milliseconds for the reject operation

#### Request Filtering Benefits

- **🚀 Performance**: Block heavy resources for faster page loads
- **🛡️ Security**: Prevent malicious content and tracking scripts
- **📊 Bandwidth**: Reduce data usage by filtering unnecessary resources
- **🎯 Selective Loading**: Control exactly which resources load
- **🔧 Testing**: Create controlled environments for testing
- **📱 Mobile Optimization**: Optimize for slower connections
- **🔒 Privacy**: Block tracking and analytics scripts

#### Common Filtering Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Media Blocking** | Performance | `type: [image, media, font]` |
| **Script Blocking** | Security | `type: [script]` |
| **Tracking Blocking** | Privacy | `url: ["*analytics*", "*tracking*"]` |
| **API Filtering** | Testing | `method: [POST, PUT], url: ["*/api/*"]` |
| **CDN Blocking** | Bandwidth | `url: ["*cdn*", "*assets*"]` |
| **Ad Blocking** | Clean UI | `url: ["*ads*", "*doubleclick*"]` |

#### Logical Operator Strategies

- **OR Operator (default)**: Reject if ANY condition matches - useful for broad blocking
- **AND Operator**: Reject only if ALL conditions match - useful for precise filtering

#### Performance Impact Notes

⚠️ **Important**: Request rejections only take effect during query execution. Quick scripts may still show assets loading in editors since rejections are active only when mutations are running.

The reject operation provides essential request filtering capabilities for performance optimization, security enhancement, privacy protection, and controlled testing environments with flexible pattern matching and logical operators.

### Page Reload (reload)

The extension provides comprehensive support for page reloading through the `reload` operation, based on the [official reload documentation](https://docs.browserless.io/bql-schema/operations/mutations/reload). This operation reloads the current page with configurable timeout and wait conditions, enabling state refresh, testing scenarios, and controlled page reloading.

#### Basic Page Reload

```bql
mutation BasicReload {
  # Navigate to initial page
  goto(url: "https://example.com") {
    status
    url
  }

  # Basic reload with default settings (30 seconds, load event)
  refresh: reload {
    status
    time
    url
  }

  # Reload with custom timeout
  quickRefresh: reload(timeout: 10000) {
    status
    time
    url
  }
}
```

#### Wait Condition Controls

```bql
mutation WaitConditions {
  # Fast reload - wait for commit only
  fastReload: reload(waitUntil: commit) {
    status
    time
    url
  }

  # DOM-based reload - wait for DOM content loaded
  domReload: reload(waitUntil: domContentLoaded) {
    status
    time
    text
    url
  }

  # Complete reload - wait for load event (default)
  completeReload: reload(waitUntil: load) {
    status
    time
    text
    url
  }

  # Network-based reload - wait for network idle
  networkReload: reload(waitUntil: networkIdle) {
    status
    time
    text
    url
  }
}
```

#### Development and Testing Scenarios

```bql
mutation TestingReload {
  # Development reload with extended timeout
  devReload: reload(
    timeout: 60000
    waitUntil: load
  ) {
    status
    time
    text
    url
  }

  # Production reload with balanced timeout
  prodReload: reload(
    timeout: 15000
    waitUntil: domContentLoaded
  ) {
    status
    time
    url
  }

  # Performance testing - ultra-fast reload
  perfReload: reload(
    timeout: 3000
    waitUntil: commit
  ) {
    status
    time
    url
  }

  # Integration testing reload
  integrationReload: reload(
    timeout: 25000
    waitUntil: load
  ) {
    status
    time
    text
    url
  }
}
```

#### State Refresh Workflows

```bql
mutation StateRefresh {
  # Initial page load
  goto(url: "https://app.example.com") {
    status
    url
  }

  # Perform state-changing operations
  userLogin: type(selector: "#username", text: "testuser") {
    time
  }

  passwordLogin: type(selector: "#password", text: "password") {
    time
  }

  submitLogin: click(selector: "#login-button") {
    time
  }

  # Reload to refresh authentication state
  refreshState: reload(
    timeout: 20000
    waitUntil: domContentLoaded
  ) {
    status
    time
    url
  }

  # Verify new state
  userDashboard: html(selector: ".user-dashboard") {
    html
    time
  }
}
```

#### Dynamic Content and SPA Reloading

```bql
mutation SPAReload {
  # SPA with network idle wait
  spaReload: reload(
    timeout: 25000
    waitUntil: networkIdle
  ) {
    status
    time
    text
    url
  }

  # API-driven content reload
  apiReload: reload(
    timeout: 15000
    waitUntil: domContentLoaded
  ) {
    status
    time
    text
    url
  }

  # Real-time content refresh
  realtimeReload: reload(
    timeout: 30000
    waitUntil: networkIdle
  ) {
    status
    time
    text
    url
  }
}
```

#### Error Recovery and Monitoring

```bql
mutation ErrorRecovery {
  # Health check reload
  healthReload: reload(
    timeout: 12000
    waitUntil: load
  ) {
    status
    time
    url
  }

  # Recovery reload with extended timeout
  recoveryReload: reload(
    timeout: 60000
    waitUntil: load
  ) {
    status
    time
    text
    url
  }

  # Monitoring reload for uptime checks
  monitorReload: reload(
    timeout: 8000
    waitUntil: domContentLoaded
  ) {
    status
    time
    url
  }
}
```

#### Reload Parameters

- **timeout** (Float, optional): Maximum time in milliseconds to wait for page load (default: 30000)
- **waitUntil** (WaitUntilHistory, optional): When to consider page fully loaded (default: load)

#### WaitUntilHistory Options

- **commit**: Network response received and document starts loading (fastest)
- **domContentLoaded**: DOMContentLoaded event fires (DOM ready)
- **load**: Load event fires - images, stylesheets loaded (default)
- **networkIdle**: No network connections for 500ms (dynamic content)

#### HTTPResponse Fields

- **status**: HTTP status code of the reloaded page
- **time**: Time taken for the reload operation in milliseconds
- **text**: Text content of the reloaded page
- **url**: Final URL after reload (may differ due to redirects)

#### Page Reload Benefits

- **🔄 State Refresh**: Clear application state and restart fresh
- **🧪 Testing**: Verify page behavior after state changes
- **🛠️ Development**: Quick refresh during development cycles
- **📊 Monitoring**: Health checks and uptime monitoring
- **🎯 Dynamic Content**: Refresh pages with real-time content
- **⚡ Performance**: Test load times and performance metrics
- **🔧 Error Recovery**: Recover from application errors or timeouts

#### Common Reload Patterns

| Pattern | Use Case | Configuration |
|---------|----------|---------------|
| **Quick Refresh** | Development | `timeout: 5000, waitUntil: commit` |
| **Standard Reload** | Production | `timeout: 15000, waitUntil: domContentLoaded` |
| **Complete Reload** | Testing | `timeout: 30000, waitUntil: load` |
| **SPA Refresh** | Dynamic Apps | `timeout: 25000, waitUntil: networkIdle` |
| **Performance Test** | Speed Testing | `timeout: 3000, waitUntil: commit` |
| **Health Check** | Monitoring | `timeout: 8000, waitUntil: domContentLoaded` |

#### Reload vs Navigation

- **Reload**: Refreshes current page, maintains URL, clears JavaScript state
- **Goto**: Navigates to new URL, full page change, initializes new context
- **Back/Forward**: Browser history navigation, may use cached content

The reload operation provides essential page refresh capabilities for state management, testing workflows, development cycles, and monitoring scenarios with flexible timeout and wait condition controls.

### Network Request Monitoring (request)

The extension provides comprehensive support for network request monitoring through the `request` operation, based on the [official request documentation](https://docs.browserless.io/bql-schema/operations/mutations/request). This operation captures and filters browser network requests by URL patterns, HTTP methods, and resource types using logical operators, enabling network analysis, API monitoring, and debugging workflows.

#### Basic Request Monitoring

```bql
mutation BasicRequestMonitoring {
  # Navigate to trigger requests
  goto(url: "https://example.com/", waitUntil: load) {
    status
  }

  # Monitor all document requests
  documentRequests: request(type: [document]) {
    url
    type
    method
    headers {
      name
      value
    }
  }

  # Track API requests
  apiRequests: request(
    url: ["*/api/*", "*/v1/*", "*/graphql*"]
  ) {
    url
    type
    method
    headers {
      name
      value
    }
  }
}
```

#### Advanced Filtering with Logical Operators

```bql
mutation AdvancedFiltering {
  # OR operator (default): match ANY condition
  thirdPartyRequests: request(
    url: ["*analytics*", "*tracking*", "*ads*"]
    operator: or
  ) {
    url
    type
    method
  }

  # AND operator: match ALL conditions
  ajaxGetRequests: request(
    type: [xhr]
    method: [GET]
    operator: and
  ) {
    url
    type
    method
    headers {
      name
      value
    }
  }

  # Complex filtering
  specificAPIs: request(
    url: ["*/auth/*", "*/login*"]
    method: [POST, PUT]
    type: [xhr, fetch]
    operator: and
  ) {
    url
    type
    method
    headers {
      name
      value
    }
  }
}
```

#### Resource Type Monitoring

```bql
mutation ResourceMonitoring {
  # Monitor image loading
  imageRequests: request(type: [image]) {
    url
    type
    method
  }

  # Track script loading
  scriptRequests: request(type: [script]) {
    url
    type
    method
    headers {
      name
      value
    }
  }

  # Monitor stylesheets
  cssRequests: request(type: [stylesheet]) {
    url
    type
    method
  }

  # Track AJAX calls
  ajaxRequests: request(type: [xhr, fetch]) {
    url
    type
    method
    headers {
      name
      value
    }
  }

  # Monitor media files
  mediaRequests: request(type: [media]) {
    url
    type
    method
  }

  # Track font loading
  fontRequests: request(type: [font]) {
    url
    type
    method
  }
}
```

#### HTTP Method Filtering

```bql
mutation MethodFiltering {
  # Monitor POST requests
  postRequests: request(method: [POST]) {
    url
    type
    method
    headers {
      name
      value
    }
  }

  # Track API write operations
  writeOperations: request(
    method: [POST, PUT, DELETE, PATCH]
    url: ["*/api/*"]
    operator: and
  ) {
    url
    type
    method
    headers {
      name
      value
    }
  }

  # Monitor read operations
  readOperations: request(
    method: [GET]
    type: [xhr, fetch]
    operator: and
  ) {
    url
    type
    method
  }
}
```

#### Wait and Timeout Controls

```bql
mutation WaitControls {
  # Wait for requests (default behavior)
  waitingRequests: request(
    url: ["*/slow-api/*"]
    wait: true
    timeout: 45000
  ) {
    url
    type
    method
  }

  # Get existing requests without waiting
  existingRequests: request(
    wait: false
    timeout: 1000
  ) {
    url
    type
    method
  }

  # Quick timeout for fast APIs
  fastAPIRequests: request(
    url: ["*/fast-api/*"]
    timeout: 5000
  ) {
    url
    type
    method
  }
}
```

#### Common Monitoring Patterns

```bql
mutation CommonPatterns {
  # Analytics and tracking
  analyticsRequests: request(
    url: [
      "*google-analytics*",
      "*gtag*",
      "*segment*",
      "*mixpanel*"
    ]
    operator: or
  ) {
    url
    type
    method
  }

  # Social media requests
  socialRequests: request(
    url: [
      "*facebook*",
      "*twitter*",
      "*linkedin*",
      "*instagram*"
    ]
    operator: or
  ) {
    url
    type
    method
  }

  # Payment processing
  paymentRequests: request(
    url: [
      "*stripe*",
      "*paypal*",
      "*square*",
      "*braintree*"
    ]
    operator: or
  ) {
    url
    type
    method
    headers {
      name
      value
    }
  }

  # CDN and assets
  cdnRequests: request(
    url: ["*cdn*", "*assets*", "*static*"]
    operator: or
  ) {
    url
    type
    method
  }

  # Error tracking
  errorTrackingRequests: request(
    url: [
      "*sentry*",
      "*bugsnag*",
      "*rollbar*"
    ]
    operator: or
  ) {
    url
    type
    method
  }
}
```

#### API Testing and Debugging

```bql
mutation APITesting {
  # GraphQL API monitoring
  graphqlRequests: request(
    url: ["*/graphql*"]
    method: [POST]
    operator: and
  ) {
    url
    type
    method
    headers {
      name
      value
    }
  }

  # REST API monitoring
  restAPIRequests: request(
    url: ["*/api/v*", "*/rest/*"]
    method: [GET, POST, PUT, DELETE]
    operator: or
  ) {
    url
    type
    method
    headers {
      name
      value
    }
  }

  # Authentication flow monitoring
  authRequests: request(
    url: ["*/auth/*", "*/login*", "*/oauth*"]
    method: [POST, GET]
    operator: or
  ) {
    url
    type
    method
    headers {
      name
      value
    }
  }
}
```

#### Request Parameters

- **type** ([ResourceType], optional): Resource types to monitor (document, xhr, fetch, script, stylesheet, image, etc.)
- **method** ([Method], optional): HTTP methods to filter (GET, POST, PUT, DELETE, PATCH, etc.)
- **timeout** (Float, optional): Maximum wait time in milliseconds (default: 30000)
- **url** ([String], optional): Glob-style URL patterns for filtering
- **wait** (Boolean, optional): Whether to wait for requests (default: true)
- **operator** (OperatorTypes, optional): Logical operator - "or" (any match) or "and" (all must match) (default: or)

#### RequestResponse Fields

- **url**: The URL of the request
- **type**: The resource type of the request (ResourceType enum)
- **method**: The HTTP method of the request (Method enum)
- **headers**: Array of request headers with name and value pairs

#### Network Monitoring Benefits

- **🔍 API Analysis**: Monitor API calls and responses for debugging
- **📊 Performance Tracking**: Analyze network performance and load times
- **🛡️ Security Monitoring**: Track suspicious or unauthorized requests
- **🧪 Testing**: Verify expected network behavior in automated tests
- **📱 Third-party Tracking**: Monitor external service integrations
- **💡 Debugging**: Identify network issues and failed requests
- **📈 Analytics**: Understand application network patterns

#### Common Monitoring Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **API Monitoring** | `url: ["*/api/*"], method: [POST, GET]` | Track API usage and responses |
| **Resource Loading** | `type: [image, script, stylesheet]` | Monitor asset loading performance |
| **Third-party Services** | `url: ["*analytics*", "*tracking*"]` | Track external service calls |
| **Authentication Flow** | `url: ["*/auth/*"], method: [POST]` | Monitor login and auth requests |
| **Error Tracking** | `url: ["*error*", "*exception*"]` | Capture error reporting requests |
| **Performance Analysis** | `type: [xhr, fetch], timeout: 5000` | Monitor AJAX performance |

#### Operator Strategy Guide

- **OR Operator (default)**: Use for broad monitoring - captures requests matching ANY filter
- **AND Operator**: Use for precise filtering - captures requests matching ALL filters

#### Wait Behavior

- **wait: true** (default): Waits for new requests matching filters (typically returns one request)
- **wait: false**: Returns existing requests immediately (may return multiple requests)

The request operation provides essential network monitoring capabilities for API analysis, performance tracking, security monitoring, and debugging workflows with flexible filtering and logical operators.

### Network Response Analysis (response)

The extension provides comprehensive support for network response analysis through the `response` operation, based on the [official response documentation](https://docs.browserless.io/bql-schema/operations/mutations/response). This operation captures and filters browser network responses by URL patterns, HTTP methods, status codes, and resource types using logical operators, enabling response analysis, API debugging, and performance monitoring workflows.

#### Basic Response Monitoring

```bql
mutation BasicResponseMonitoring {
  # Navigate to trigger responses
  goto(url: "https://example.com/", waitUntil: load) {
    status
  }

  # Monitor all document responses
  documentResponses: response(type: [document]) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # Track successful responses
  successfulResponses: response(status: [200, 201, 204]) {
    url
    type
    method
    status
    body
  }

  # Monitor API responses
  apiResponses: response(
    url: ["*/api/*", "*/v1/*", "*/graphql*"]
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }
}
```

#### Status Code Filtering

```bql
mutation StatusCodeFiltering {
  # Monitor successful responses
  successResponses: response(
    status: [200, 201, 202, 204]
    operator: or
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # Track error responses
  errorResponses: response(
    status: [400, 401, 403, 404, 500, 502, 503]
    operator: or
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # Monitor redirect responses
  redirectResponses: response(
    status: [301, 302, 303, 307, 308]
    operator: or
  ) {
    url
    type
    method
    status
    headers {
      name
      value
    }
  }

  # Client error monitoring
  clientErrors: response(
    status: [400, 401, 403, 404, 409, 422]
    operator: or
  ) {
    url
    type
    method
    status
    body
  }

  # Server error monitoring
  serverErrors: response(
    status: [500, 501, 502, 503, 504]
    operator: or
  ) {
    url
    type
    method
    status
    body
  }
}
```

#### Advanced Filtering with Logical Operators

```bql
mutation AdvancedFiltering {
  # AND operator: successful GET responses
  successfulGets: response(
    status: [200, 201, 204]
    method: [GET]
    operator: and
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # AND operator: API POST responses
  apiPostResponses: response(
    url: ["*/api/*"]
    method: [POST]
    type: [xhr, fetch]
    operator: and
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # OR operator: error or redirect responses
  problemResponses: response(
    status: [400, 404, 500, 301, 302]
    operator: or
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # Complex filtering: successful JSON API responses
  successfulJsonAPIs: response(
    url: ["*/api/*", "*/json*"]
    status: [200, 201]
    method: [GET, POST]
    type: [xhr, fetch]
    operator: and
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }
}
```

#### Resource Type Response Monitoring

```bql
mutation ResourceTypeMonitoring {
  # Monitor AJAX/XHR responses
  ajaxResponses: response(type: [xhr]) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # Track Fetch API responses
  fetchResponses: response(type: [fetch]) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # Monitor script responses
  scriptResponses: response(type: [script]) {
    url
    type
    method
    status
    body
  }

  # Track stylesheet responses
  cssResponses: response(type: [stylesheet]) {
    url
    type
    method
    status
  }

  # Monitor image responses
  imageResponses: response(type: [image]) {
    url
    type
    method
    status
  }

  # Track font responses
  fontResponses: response(type: [font]) {
    url
    type
    method
    status
  }

  # Monitor media responses
  mediaResponses: response(type: [media]) {
    url
    type
    method
    status
  }
}
```

#### HTTP Method Response Analysis

```bql
mutation MethodResponseAnalysis {
  # Monitor POST responses
  postResponses: response(method: [POST]) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # Track write operation responses
  writeResponses: response(
    method: [POST, PUT, DELETE, PATCH]
    url: ["*/api/*"]
    operator: and
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # Monitor read operation responses
  readResponses: response(
    method: [GET]
    type: [xhr, fetch]
    operator: and
  ) {
    url
    type
    method
    status
    body
  }
}
```

#### Wait and Timeout Controls

```bql
mutation WaitControls {
  # Wait for responses (default behavior)
  waitingResponses: response(
    url: ["*/slow-api/*"]
    wait: true
    timeout: 45000
  ) {
    url
    type
    method
    status
    body
  }

  # Get existing responses without waiting
  existingResponses: response(
    wait: false
    timeout: 1000
  ) {
    url
    type
    method
    status
  }

  # Quick timeout for fast APIs
  fastAPIResponses: response(
    url: ["*/fast-api/*"]
    timeout: 5000
  ) {
    url
    type
    method
    status
    body
  }
}
```

#### Error and Performance Monitoring

```bql
mutation ErrorPerformanceMonitoring {
  # Monitor HTTP errors
  httpErrors: response(
    status: [400, 401, 403, 404, 422, 429, 500, 502, 503, 504]
    operator: or
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # Track timeout responses
  timeoutResponses: response(
    status: [408, 504]
    operator: or
  ) {
    url
    type
    method
    status
    body
  }

  # Monitor rate limiting
  rateLimitResponses: response(status: [429]) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # Track large responses
  largeContentResponses: response(
    url: ["*.zip", "*.pdf", "*.mp4"]
    operator: or
  ) {
    url
    type
    method
    status
  }
}
```

#### Common Response Analysis Patterns

```bql
mutation CommonAnalysisPatterns {
  # Analytics response monitoring
  analyticsResponses: response(
    url: [
      "*google-analytics*",
      "*gtag*",
      "*segment*",
      "*mixpanel*"
    ]
    operator: or
  ) {
    url
    type
    method
    status
    body
  }

  # Authentication response analysis
  authResponses: response(
    url: ["*/auth/*", "*/login*", "*/oauth*"]
    status: [200, 401, 403]
    operator: and
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # Payment processing responses
  paymentResponses: response(
    url: [
      "*stripe*",
      "*paypal*",
      "*square*"
    ]
    status: [200, 400, 402]
    operator: and
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # CDN and asset responses
  cdnResponses: response(
    url: ["*cdn*", "*assets*", "*static*"]
    status: [200, 304]
    operator: and
  ) {
    url
    type
    method
    status
  }

  # Third-party API responses
  thirdPartyResponses: response(
    url: [
      "*amazonaws.com*",
      "*googleapis.com*",
      "*github.com*"
    ]
    operator: or
  ) {
    url
    type
    method
    status
    headers {
      name
      value
    }
  }
}
```

#### API Testing and Content Analysis

```bql
mutation APIContentAnalysis {
  # GraphQL response analysis
  graphqlResponses: response(
    url: ["*/graphql*"]
    method: [POST]
    status: [200, 400]
    operator: and
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # REST API response monitoring
  restAPIResponses: response(
    url: ["*/api/v*", "*/rest/*"]
    status: [200, 201, 400, 404, 500]
    operator: and
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # JSON content responses
  jsonResponses: response(
    url: ["*.json", "*/api/*"]
    type: [xhr, fetch, document]
    operator: and
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # XML/RSS responses
  xmlResponses: response(
    url: ["*.xml", "*.rss", "*.atom"]
    operator: or
  ) {
    url
    type
    method
    status
    body
  }
}
```

#### Security and Compliance Monitoring

```bql
mutation SecurityCompliance {
  # Monitor security-related responses
  securityResponses: response(
    url: [
      "*/2fa/*",
      "*/verify/*",
      "*/captcha/*",
      "*/security/*"
    ]
    status: [200, 401, 403]
    operator: and
  ) {
    url
    type
    method
    status
    body
    headers {
      name
      value
    }
  }

  # File download monitoring
  downloadResponses: response(
    url: ["*.pdf", "*.zip", "*.csv", "*.xlsx", "*.doc*"]
    operator: or
  ) {
    url
    type
    method
    status
    headers {
      name
      value
    }
  }

  # Compression monitoring
  compressedResponses: response(
    url: ["*.gz", "*.br", "*.zip"]
    operator: or
  ) {
    url
    type
    method
    status
    headers {
      name
      value
    }
  }
}
```

#### Response Parameters

- **status** ([Int], optional): HTTP status codes to filter responses
- **method** ([Method], optional): HTTP methods to filter (GET, POST, PUT, DELETE, PATCH, etc.)
- **type** ([ResourceType], optional): Resource types to monitor (document, xhr, fetch, script, stylesheet, image, etc.)
- **timeout** (Float, optional): Maximum wait time in milliseconds (default: 30000)
- **url** ([String], optional): Glob-style URL patterns for filtering
- **wait** (Boolean, optional): Whether to wait for responses (default: true)
- **operator** (OperatorTypes, optional): Logical operator - "or" (any match) or "and" (all must match) (default: or)

#### ResponseResponse Fields

- **url**: The URL of the response
- **type**: The resource type of the response (ResourceType enum)
- **method**: The HTTP method of the response (Method enum)
- **status**: The HTTP status code of the response
- **body**: The response body content
- **headers**: Array of response headers with name and value pairs

#### Response Analysis Benefits

- **🔍 API Debugging**: Analyze API responses and error conditions
- **📊 Performance Analysis**: Monitor response times and content sizes
- **🛡️ Security Monitoring**: Track authentication and authorization responses
- **🧪 Testing**: Verify expected response behavior in automated tests
- **📱 Content Analysis**: Examine response bodies and headers
- **💡 Error Tracking**: Identify and debug failed responses
- **📈 Monitoring**: Understand application response patterns and health

#### Common Response Monitoring Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **API Success Monitoring** | `url: ["*/api/*"], status: [200, 201]` | Track successful API responses |
| **Error Response Analysis** | `status: [400, 404, 500], operator: or` | Monitor and debug error responses |
| **Authentication Tracking** | `url: ["*/auth/*"], status: [200, 401]` | Monitor auth response patterns |
| **Content Type Analysis** | `type: [xhr, fetch], body: included` | Analyze API response content |
| **Performance Monitoring** | `timeout: 5000, status: [200]` | Track response performance |
| **Security Monitoring** | `status: [403, 429], operator: or` | Monitor security-related responses |

#### Status Code Categories

- **Success (2xx)**: 200 (OK), 201 (Created), 202 (Accepted), 204 (No Content)
- **Redirection (3xx)**: 301 (Moved Permanently), 302 (Found), 304 (Not Modified)
- **Client Error (4xx)**: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
- **Server Error (5xx)**: 500 (Internal Server Error), 502 (Bad Gateway), 503 (Service Unavailable)

#### Operator Strategy Guide

- **OR Operator (default)**: Use for broad monitoring - captures responses matching ANY filter
- **AND Operator**: Use for precise filtering - captures responses matching ALL filters

#### Wait Behavior

- **wait: true** (default): Waits for new responses matching filters (typically returns one response)
- **wait: false**: Returns existing responses immediately (may return multiple responses)

#### Content Analysis Tips

- **Body Field**: Contains response content - useful for API debugging and content validation
- **Headers Field**: Provides response headers - essential for security and caching analysis
- **Status + Body**: Combine status codes with body content for comprehensive error analysis

The response operation provides essential network response analysis capabilities for API debugging, performance monitoring, security analysis, and content validation workflows with flexible filtering and logical operators.

### Screenshot Capture (screenshot)

The extension provides comprehensive support for screenshot capture through the `screenshot` operation, based on the [official screenshot documentation](https://docs.browserless.io/bql-schema/operations/mutations/screenshot). This operation captures page or element screenshots with advanced format control, quality optimization, clipping regions, transparency support, and performance tuning options for visual testing and documentation workflows.

#### Basic Screenshot Operations

```bql
mutation BasicScreenshots {
  # Navigate to page
  goto(url: "https://example.com") {
    status
  }

  # Basic viewport screenshot
  viewportScreenshot: screenshot {
    base64
  }

  # Full page screenshot
  fullPageScreenshot: screenshot(fullPage: true) {
    base64
  }

  # Element-specific screenshot
  headerScreenshot: screenshot(selector: "header") {
    base64
  }

  # Main content screenshot
  contentScreenshot: screenshot(selector: "main, .content") {
    base64
  }
}
```

#### Image Format and Quality Control

```bql
mutation FormatQuality {
  # PNG screenshot (lossless)
  pngScreenshot: screenshot(type: png) {
    base64
  }

  # High quality JPEG
  jpegHighQuality: screenshot(
    type: jpeg
    quality: 95
  ) {
    base64
  }

  # Balanced quality JPEG
  jpegBalanced: screenshot(
    type: jpeg
    quality: 80
    fullPage: true
  ) {
    base64
  }

  # Compressed JPEG for performance
  jpegCompressed: screenshot(
    type: jpeg
    quality: 60
    optimizeForSpeed: true
  ) {
    base64
  }

  # PNG with transparency
  transparentPNG: screenshot(
    type: png
    omitBackground: true
    selector: ".modal"
  ) {
    base64
  }
}
```

#### Clipped Region Screenshots

```bql
mutation ClippedRegions {
  # Header area clip
  headerClip: screenshot(
    clip: {
      x: 0
      y: 0
      width: 1200
      height: 150
    }
    type: jpeg
    quality: 85
  ) {
    base64
  }

  # Center content clip
  centerClip: screenshot(
    clip: {
      x: 200
      y: 150
      width: 600
      height: 500
    }
    type: png
  ) {
    base64
  }

  # Custom region clip
  customClip: screenshot(
    clip: {
      x: 100
      y: 100
      width: 500
      height: 400
    }
    type: jpeg
    quality: 90
  ) {
    base64
  }
}
```

#### Performance Optimization

```bql
mutation PerformanceOptimization {
  # Speed optimized screenshot
  fastScreenshot: screenshot(
    optimizeForSpeed: true
    type: jpeg
    quality: 65
  ) {
    base64
  }

  # Quality optimized screenshot
  qualityScreenshot: screenshot(
    optimizeForSpeed: false
    type: png
  ) {
    base64
  }

  # Viewport-only capture (no scrolling)
  viewportOnly: screenshot(
    captureBeyondViewport: false
    fromSurface: false
  ) {
    base64
  }

  # Surface capture with beyond viewport
  surfaceCapture: screenshot(
    fromSurface: true
    captureBeyondViewport: true
    fullPage: true
  ) {
    base64
  }
}
```

#### Element-Specific Screenshots

```bql
mutation ElementCapture {
  # Form screenshot
  formScreenshot: screenshot(
    selector: "form"
    type: png
    timeout: 10000
  ) {
    base64
  }

  # Navigation screenshot
  navScreenshot: screenshot(
    selector: "nav, .navigation"
    type: jpeg
    quality: 85
  ) {
    base64
  }

  # Modal screenshot with transparency
  modalScreenshot: screenshot(
    selector: ".modal, .popup"
    type: png
    omitBackground: true
    timeout: 8000
  ) {
    base64
  }

  # Card component screenshot
  cardScreenshot: screenshot(
    selector: ".card, .panel"
    type: png
  ) {
    base64
  }

  # Hero section screenshot
  heroScreenshot: screenshot(
    selector: ".hero, .banner"
    type: jpeg
    quality: 90
    timeout: 15000
  ) {
    base64
  }
}
```

#### Responsive and Mobile Screenshots

```bql
mutation ResponsiveCapture {
  # Mobile navigation
  mobileNav: screenshot(
    selector: ".mobile-nav, .hamburger-menu"
    type: png
    timeout: 10000
  ) {
    base64
  }

  # Touch interface elements
  touchInterface: screenshot(
    selector: ".touch-controls"
    type: png
    timeout: 12000
  ) {
    base64
  }

  # Responsive card layout
  responsiveCards: screenshot(
    selector: ".responsive-grid"
    type: jpeg
    quality: 80
    fullPage: true
  ) {
    base64
  }

  # Mobile form screenshot
  mobileForm: screenshot(
    selector: ".mobile-form"
    type: png
    omitBackground: true
    timeout: 8000
  ) {
    base64
  }
}
```

#### Advanced Transparency and Background Control

```bql
mutation TransparencyControl {
  # Transparent background capture
  transparentCapture: screenshot(
    type: png
    omitBackground: true
  ) {
    base64
  }

  # Element with transparent background
  transparentElement: screenshot(
    selector: ".overlay-element"
    type: png
    omitBackground: true
    timeout: 10000
  ) {
    base64
  }

  # White background screenshot
  whiteBackground: screenshot(
    type: png
    omitBackground: false
    fullPage: true
  ) {
    base64
  }

  # Floating element with transparency
  floatingElement: screenshot(
    selector: ".floating-panel"
    type: png
    omitBackground: true
    captureBeyondViewport: true
  ) {
    base64
  }
}
```

#### Timeout and Wait Management

```bql
mutation TimeoutManagement {
  # Quick capture with short timeout
  quickCapture: screenshot(
    selector: ".fast-element"
    timeout: 5000
    optimizeForSpeed: true
  ) {
    base64
  }

  # Standard timeout capture
  standardCapture: screenshot(
    selector: ".standard-element"
    timeout: 15000
    type: png
  ) {
    base64
  }

  # Extended timeout for slow elements
  slowCapture: screenshot(
    selector: ".slow-loading-element"
    timeout: 45000
    type: jpeg
    quality: 85
  ) {
    base64
  }

  # Dynamic content capture
  dynamicCapture: screenshot(
    selector: ".dynamic-content"
    timeout: 20000
    type: png
    captureBeyondViewport: true
  ) {
    base64
  }
}
```

#### UI State and Accessibility Screenshots

```bql
mutation UIStateCapture {
  # Focus state screenshot
  focusState: screenshot(
    selector: ":focus, .focused"
    type: png
    timeout: 5000
  ) {
    base64
  }

  # Hover state screenshot
  hoverState: screenshot(
    selector: ":hover, .hovered"
    type: png
    timeout: 3000
  ) {
    base64
  }

  # Error state screenshot
  errorState: screenshot(
    selector: ".error, .invalid"
    type: png
    omitBackground: true
  ) {
    base64
  }

  # Success state screenshot
  successState: screenshot(
    selector: ".success, .valid"
    type: png
    timeout: 8000
  ) {
    base64
  }

  # Active state screenshot
  activeState: screenshot(
    selector: ":active, .active"
    type: png
    timeout: 2000
  ) {
    base64
  }
}
```

#### Content-Specific Screenshots

```bql
mutation ContentCapture {
  # Article content screenshot
  articleContent: screenshot(
    selector: "article, .article-content"
    type: jpeg
    quality: 90
    timeout: 15000
  ) {
    base64
  }

  # Code block screenshot
  codeBlock: screenshot(
    selector: "pre, code, .code-block"
    type: png
    timeout: 8000
  ) {
    base64
  }

  # Data visualization screenshot
  dataVisualization: screenshot(
    selector: ".chart, .graph, svg"
    type: png
    timeout: 12000
  ) {
    base64
  }

  # Media gallery screenshot
  mediaGallery: screenshot(
    selector: ".gallery, .carousel"
    type: jpeg
    quality: 85
    timeout: 10000
  ) {
    base64
  }

  # Table data screenshot
  tableData: screenshot(
    selector: "table, .data-table"
    type: png
    fullPage: false
  ) {
    base64
  }
}
```

#### Complex Capture Scenarios

```bql
mutation ComplexCapture {
  # High quality clipped element
  highQualityClipped: screenshot(
    selector: ".main-content"
    clip: {
      x: 0
      y: 0
      width: 600
      height: 400
    }
    type: jpeg
    quality: 95
    timeout: 20000
  ) {
    base64
  }

  # Transparent element with viewport control
  transparentViewport: screenshot(
    selector: ".floating-element"
    type: png
    omitBackground: true
    timeout: 15000
    captureBeyondViewport: true
    fromSurface: true
  ) {
    base64
  }

  # Performance optimized element capture
  performanceOptimized: screenshot(
    selector: ".performance-critical"
    optimizeForSpeed: true
    type: jpeg
    quality: 65
    timeout: 5000
    captureBeyondViewport: false
  ) {
    base64
  }

  # Full page with transparency
  fullPageTransparent: screenshot(
    fullPage: true
    type: png
    omitBackground: true
    timeout: 30000
    optimizeForSpeed: false
  ) {
    base64
  }
}
```

#### Screenshot Parameters

- **captureBeyondViewport** (Boolean, optional): Capture beyond the viewport. Default: False if no clip, True otherwise
- **clip** (ScreenshotClip, optional): Specifies region coordinates to clip (x, y, width, height)
- **fromSurface** (Boolean, optional): Capture from surface rather than view. Default: True
- **fullPage** (Boolean, optional): Take full page screenshot. Default: False
- **omitBackground** (Boolean, optional): Hide white background for transparency. Default: False
- **optimizeForSpeed** (Boolean, optional): Optimize encoding for speed vs size. Default: False
- **quality** (Float, optional): Image quality 0-100 (JPEG only)
- **selector** (String, optional): CSS selector for element capture
- **type** (ScreenshotType, optional): Image format (png, jpeg)
- **timeout** (Float, optional): Maximum wait time in milliseconds. Default: 30000

#### ScreenshotResponse Fields

- **base64**: Base64 encoded screenshot image data

#### Screenshot Capture Benefits

- **📸 Visual Testing**: Automated visual regression testing and UI validation
- **📋 Documentation**: Generate visual documentation and user guides
- **🐛 Debugging**: Capture UI states for debugging and issue reporting
- **🎯 Element Isolation**: Screenshot specific components and sections
- **⚡ Performance Options**: Balance quality vs speed for different use cases
- **🖼️ Format Control**: Choose optimal image format and quality settings
- **🔍 Precise Capture**: Clip specific regions and control transparency
- **📱 Responsive Testing**: Capture mobile and responsive UI elements

#### Common Screenshot Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **Full Page Capture** | `fullPage: true, type: png` | Complete page documentation |
| **Element Screenshot** | `selector: ".component", type: png` | Component isolation testing |
| **High Quality JPEG** | `type: jpeg, quality: 95` | Print-quality documentation |
| **Fast Capture** | `optimizeForSpeed: true, quality: 60` | Performance testing screenshots |
| **Transparent PNG** | `type: png, omitBackground: true` | UI overlay documentation |
| **Clipped Region** | `clip: {x, y, width, height}` | Specific area capture |

#### Image Format Guide

- **PNG**: Lossless compression, perfect for UI elements, supports transparency
- **JPEG**: Lossy compression, smaller files, better for photos, quality 0-100

#### Quality Settings

- **95-100**: Highest quality for print documentation
- **80-90**: High quality for web documentation
- **65-80**: Balanced quality for most use cases
- **50-65**: Performance optimized for automated testing
- **30-50**: Minimal size for thumbnails and previews

#### Performance Optimization Tips

- **optimizeForSpeed: true**: Faster encoding, larger files
- **captureBeyondViewport: false**: Viewport-only capture for speed
- **JPEG with quality 60-70**: Good balance of size and quality
- **Element selectors**: Faster than full page captures
- **Shorter timeouts**: Fail fast for missing elements

#### Viewport vs Surface Capture

- **fromSurface: true** (default): Captures from the surface layer
- **fromSurface: false**: Captures from the view layer
- **captureBeyondViewport: true**: Includes content outside viewport
- **captureBeyondViewport: false**: Viewport-only capture

#### Transparency Best Practices

- Use **PNG format** for transparency support
- Set **omitBackground: true** to remove white background
- Best for UI overlays, modals, and floating elements
- Not supported with JPEG format

The screenshot operation provides essential visual capture capabilities for automated testing, documentation generation, debugging workflows, and UI validation with comprehensive format control and performance optimization options.

### Scroll Operation (scroll)

Waits for a selector, then scrolls to it on the page or an x,y coordinate in pixels. Provides precise scrolling control for element visibility, page navigation, and viewport positioning with wait conditions and timeout management for enhanced user experience and automation workflows.

#### Basic Scroll Usage

```bql
mutation ScrollBasic {
  goto(url: "https://example.com") {
    status
  }
  
  # Scroll to header element
  scroll(selector: "header") {
    time
  }
}
```

#### Element-Based Scrolling

```bql
mutation ElementScrolling {
  # Basic element scrolling
  scrollToFooter: scroll(selector: "footer") {
    time
  }
  
  # Multiple selector scrolling
  scrollToNav: scroll(selector: "nav, .navigation") {
    time
  }
  
  # Content area scrolling
  scrollToMain: scroll(selector: "main, .content, article") {
    time
  }
  
  # Form scrolling
  scrollToForm: scroll(selector: "form") {
    time
  }
  
  # Interactive element scrolling
  scrollToButton: scroll(selector: "button, .btn") {
    time
  }
}
```

#### Coordinate-Based Scrolling

```bql
mutation CoordinateScrolling {
  # Scroll to top of page
  scrollToTop: scroll(x: 0, y: 0) {
    time
  }
  
  # Scroll to bottom of page
  scrollToBottom: scroll(y: 9999) {
    time
  }
  
  # Precise coordinate scrolling
  preciseScroll: scroll(x: 500, y: 1000) {
    time
  }
  
  # Horizontal scroll only
  horizontalScroll: scroll(x: 800, y: 0) {
    time
  }
  
  # Vertical scroll only
  verticalScroll: scroll(x: 0, y: 1500) {
    time
  }
  
  # Center viewport scroll
  centerScroll: scroll(x: 400, y: 600) {
    time
  }
}
```

#### Visibility-Based Scrolling

```bql
mutation VisibilityScrolling {
  # Scroll to visible elements only
  visibleContentScroll: scroll(
    selector: ".content"
    visible: true
  ) {
    time
  }
  
  # Visible form scrolling
  visibleFormScroll: scroll(
    selector: "form"
    visible: true
    timeout: 8000
  ) {
    time
  }
  
  # Visible navigation scrolling
  visibleNavScroll: scroll(
    selector: "nav"
    visible: true
    timeout: 10000
  ) {
    time
  }
  
  # Visible button scrolling
  visibleButtonScroll: scroll(
    selector: "button"
    visible: true
  ) {
    time
  }
}
```

#### Timeout and Wait Control

```bql
mutation TimeoutWaitControl {
  # Quick timeout scroll
  quickScroll: scroll(
    selector: ".fast-element"
    timeout: 5000
  ) {
    time
  }
  
  # Extended timeout scroll
  extendedScroll: scroll(
    selector: ".slow-loading-element"
    timeout: 30000
  ) {
    time
  }
  
  # Scroll without waiting
  immediateScroll: scroll(
    selector: ".immediate-element"
    wait: false
  ) {
    time
  }
  
  # Scroll with wait and timeout
  waitTimeoutScroll: scroll(
    selector: ".conditional-element"
    wait: true
    timeout: 15000
  ) {
    time
  }
}
```

#### Complex Scroll Combinations

```bql
mutation ComplexScrolling {
  # Visible element with timeout
  visibleTimeoutScroll: scroll(
    selector: ".visible-target"
    visible: true
    timeout: 12000
  ) {
    time
  }
  
  # Immediate visible scroll
  immediateVisibleScroll: scroll(
    selector: ".visible-immediate"
    visible: true
    wait: false
  ) {
    time
  }
  
  # Complete combination scroll
  complexScroll: scroll(
    selector: ".complex-target"
    visible: true
    wait: true
    timeout: 25000
  ) {
    time
  }
}
```

#### Page Navigation Scrolling

```bql
mutation PageNavigation {
  # Section scrolling
  scrollToIntro: scroll(selector: ".intro, #introduction") {
    time
  }
  
  scrollToAbout: scroll(selector: ".about, #about") {
    time
  }
  
  scrollToServices: scroll(selector: ".services, #services") {
    time
  }
  
  scrollToContact: scroll(selector: ".contact, #contact") {
    time
  }
  
  # Anchor link scrolling
  scrollToAnchor: scroll(selector: "nav a[href^='#']") {
    time
  }
  
  # Breadcrumb scrolling
  scrollToBreadcrumbs: scroll(selector: ".breadcrumbs") {
    time
  }
}
```

#### Mobile and Responsive Scrolling

```bql
mutation MobileScrolling {
  # Mobile navigation scroll
  mobileNavScroll: scroll(
    selector: ".mobile-nav, .hamburger-menu"
    visible: true
    timeout: 10000
  ) {
    time
  }
  
  # Touch interface scroll
  touchInterfaceScroll: scroll(
    selector: ".touch-controls"
    visible: true
    timeout: 12000
  ) {
    time
  }
  
  # Responsive card scroll
  responsiveCardScroll: scroll(
    selector: ".responsive-card"
    visible: true
  ) {
    time
  }
  
  # Mobile form scroll
  mobileFormScroll: scroll(
    selector: ".mobile-form"
    timeout: 8000
  ) {
    time
  }
}
```

#### Content-Specific Scrolling

```bql
mutation ContentScrolling {
  # Article content scroll
  articleScroll: scroll(
    selector: "article, .article-content"
    timeout: 15000
  ) {
    time
  }
  
  # Code block scroll
  codeScroll: scroll(
    selector: "pre, code, .code-block"
    timeout: 8000
  ) {
    time
  }
  
  # Media gallery scroll
  galleryScroll: scroll(
    selector: ".gallery, .carousel"
    timeout: 10000
  ) {
    time
  }
  
  # Data visualization scroll
  dataVizScroll: scroll(
    selector: ".chart, .graph, svg"
    timeout: 12000
  ) {
    time
  }
  
  # Comments section scroll
  commentsScroll: scroll(selector: ".comments, #comments") {
    time
  }
}
```

#### UI Component Scrolling

```bql
mutation UIComponentScrolling {
  # Modal scroll
  modalScroll: scroll(
    selector: ".modal, .popup"
    visible: true
    timeout: 8000
  ) {
    time
  }
  
  # Card component scroll
  cardScroll: scroll(selector: ".card, .panel") {
    time
  }
  
  # Hero section scroll
  heroScroll: scroll(
    selector: ".hero, .banner, .jumbotron"
    timeout: 10000
  ) {
    time
  }
  
  # Tab content scroll
  tabContentScroll: scroll(
    selector: ".tab-content, .tab-panel"
    visible: true
  ) {
    time
  }
  
  # Accordion scroll
  accordionScroll: scroll(
    selector: ".accordion, .collapsible"
    visible: true
  ) {
    time
  }
}
```

#### Sequential Scrolling Workflow

```bql
mutation ScrollWorkflow {
  # Complete page tour
  pageTourStart: scroll(x: 0, y: 0) {
    time
  }
  
  pageTourHeader: scroll(selector: "header") {
    time
  }
  
  pageTourNav: scroll(selector: "nav") {
    time
  }
  
  pageTourMain: scroll(selector: "main") {
    time
  }
  
  pageTourFooter: scroll(selector: "footer") {
    time
  }
  
  pageTourEnd: scroll(y: 9999) {
    time
  }
  
  # Progressive coordinate scrolling
  progressiveScroll1: scroll(y: 500) {
    time
  }
  
  progressiveScroll2: scroll(y: 1000) {
    time
  }
  
  progressiveScroll3: scroll(y: 1500) {
    time
  }
}
```

#### Accessibility and Performance Scrolling

```bql
mutation AccessibilityScrolling {
  # Skip link scroll
  skipLinkScroll: scroll(selector: ".skip-link, #skip") {
    time
  }
  
  # Focus element scroll
  focusElementScroll: scroll(
    selector: ":focus, .focused"
    visible: true
    timeout: 5000
  ) {
    time
  }
  
  # Landmark scroll
  landmarkScroll: scroll(
    selector: "[role='main'], [role='navigation']"
    timeout: 8000
  ) {
    time
  }
  
  # Aria label scroll
  ariaLabelScroll: scroll(
    selector: "[aria-label], [aria-labelledby]"
    visible: true
  ) {
    time
  }
}
```

#### Scroll Parameters

- **selector** (String, optional): DOM selector of element to scroll to
- **timeout** (Float, optional): Wait time for element in milliseconds. Default: 30000
- **visible** (Boolean, optional): Only scroll if element is visible. Default: false
- **wait** (Boolean, optional): Wait for element before scrolling. Default: true
- **x** (Float, optional): X coordinate in pixels to scroll to
- **y** (Float, optional): Y coordinate in pixels to scroll to

#### ScrollResponse Fields

- **time**: Time taken for scroll operation in milliseconds

#### Scroll Benefits

- **📜 Enhanced Navigation**: Smooth scrolling to specific page sections and elements
- **🎯 Precise Positioning**: Coordinate-based scrolling for exact viewport control
- **⚡ Automation Support**: Essential for automated testing and interaction workflows
- **👁️ Visibility Control**: Conditional scrolling based on element visibility
- **📱 Responsive Design**: Adaptable scrolling across different screen sizes
- **⏱️ Timeout Management**: Flexible wait conditions for dynamic content loading
- **🔧 User Experience**: Improved page navigation and content accessibility

#### Common Scroll Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **Element Navigation** | `selector: "header"` | Navigate to page sections |
| **Top of Page** | `x: 0, y: 0` | Return to page beginning |
| **Bottom of Page** | `y: 9999` | Scroll to page end |
| **Conditional Scroll** | `visible: true, timeout: 10000` | Scroll only if element visible |
| **Immediate Scroll** | `wait: false` | Fast scrolling without waiting |
| **Precise Position** | `x: 500, y: 1000` | Exact coordinate positioning |

#### Scrolling Strategies

- **Element-based**: Semantic navigation using CSS selectors
- **Coordinate-based**: Precise pixel-level positioning control
- **Visibility-conditional**: Scroll only when elements are visible
- **Wait-controlled**: Manage timing for dynamic content loading

#### Timeout Recommendations

- **5000ms**: Fast static elements
- **10000ms**: Standard dynamic content
- **15000ms**: Complex loading scenarios
- **30000ms**: Heavy applications and slow networks

#### Wait Behavior Control

- **wait: true** (default): Waits for element to appear before scrolling
- **wait: false**: Attempts immediate scroll without waiting
- **visible: true**: Only scrolls if element is currently visible
- **visible: false** (default): Scrolls regardless of visibility

The scroll operation provides essential navigation capabilities for user experience enhancement, automated testing workflows, accessibility improvements, and precise viewport management across web applications.

### Select Operation (select)

Selects a value from a dropdown or multiple select element. Supports both single and multiple option selection with scroll, visibility, and timeout controls for enhanced form automation and user interaction workflows.

#### Basic Select Usage

```bql
mutation SelectBasic {
  goto(url: "https://example.com/form") {
    status
  }
  
  # Basic single value selection
  select(
    selector: "select[name='country']"
    value: "US"
  ) {
    time
  }
}
```

#### Single Value Selection

```bql
mutation SingleSelection {
  # Country selection
  countrySelect: select(
    selector: "select[name='country']"
    value: "US"
  ) {
    time
  }
  
  # Language selection
  languageSelect: select(
    selector: "select#language"
    value: "en"
  ) {
    time
  }
  
  # Category selection
  categorySelect: select(
    selector: "select.category"
    value: "technology"
  ) {
    time
  }
  
  # Priority selection
  prioritySelect: select(
    selector: "select[name='priority']"
    value: "high"
  ) {
    time
  }
  
  # Status selection
  statusSelect: select(
    selector: "select[name='status']"
    value: "active"
  ) {
    time
  }
}
```

#### Multiple Value Selection

```bql
mutation MultipleSelection {
  # Multiple skills selection
  skillsSelect: select(
    selector: "select[multiple][name='skills']"
    value: ["javascript", "typescript", "react", "node"]
  ) {
    time
  }
  
  # Multiple regions selection
  regionsSelect: select(
    selector: "select[multiple][name='regions']"
    value: ["north-america", "europe", "asia-pacific"]
  ) {
    time
  }
  
  # Multiple interests selection
  interestsSelect: select(
    selector: "select[multiple].interests"
    value: ["sports", "music", "travel", "technology"]
  ) {
    time
  }
  
  # Multiple preferences selection
  preferencesSelect: select(
    selector: "select[multiple]#preferences"
    value: ["email", "sms", "push"]
  ) {
    time
  }
}
```

#### Form Context Selection

```bql
mutation FormContextSelection {
  # Registration form
  registrationCountry: select(
    selector: "form#registration select[name='country']"
    value: "CA"
  ) {
    time
  }
  
  # Profile form
  profileIndustry: select(
    selector: "form.profile select[name='industry']"
    value: "software"
  ) {
    time
  }
  
  # Contact form
  contactSubject: select(
    selector: "form#contact select[name='subject']"
    value: "support"
  ) {
    time
  }
  
  # Survey form
  surveyRating: select(
    selector: "form.survey select[name='rating']"
    value: "excellent"
  ) {
    time
  }
}
```

#### Visibility and Wait Control

```bql
mutation VisibilityWaitControl {
  # Select visible dropdown only
  visibleSelect: select(
    selector: "select.visible-dropdown"
    value: "option1"
    visible: true
  ) {
    time
  }
  
  # Select with timeout
  timeoutSelect: select(
    selector: "select.slow-loading"
    value: "option2"
    timeout: 15000
  ) {
    time
  }
  
  # Select without waiting
  immediateSelect: select(
    selector: "select#immediate"
    value: "quick-option"
    wait: false
  ) {
    time
  }
  
  # Combined visibility and timeout
  visibleTimeoutSelect: select(
    selector: "select.conditional"
    value: "conditional-option"
    visible: true
    timeout: 12000
  ) {
    time
  }
}
```

#### Scroll Behavior Control

```bql
mutation ScrollBehaviorControl {
  # Select with scrolling (default)
  scrollSelect: select(
    selector: "select.needs-scroll"
    value: "scroll-option"
    scroll: true
  ) {
    time
  }
  
  # Select without scrolling
  noScrollSelect: select(
    selector: "select.no-scroll-needed"
    value: "no-scroll-option"
    scroll: false
  ) {
    time
  }
  
  # Footer select with scroll
  footerScrollSelect: select(
    selector: "footer select[name='footer-option']"
    value: "footer-value"
    scroll: true
  ) {
    time
  }
  
  # Header select without scroll
  headerNoScrollSelect: select(
    selector: "header select[name='header-option']"
    value: "header-value"
    scroll: false
  ) {
    time
  }
}
```

#### Complex Parameter Combinations

```bql
mutation ComplexParameterCombinations {
  # Complete parameter select
  completeSelect: select(
    selector: "select.all-parameters"
    value: "complete-option"
    timeout: 20000
    scroll: true
    visible: true
    wait: true
  ) {
    time
  }
  
  # Optimized fast select
  optimizedSelect: select(
    selector: "select.optimized"
    value: "optimized-option"
    visible: false
    wait: false
    scroll: false
    timeout: 5000
  ) {
    time
  }
  
  # Modal context select
  modalSelect: select(
    selector: ".modal select[name='modal-option']"
    value: "modal-value"
    visible: true
    timeout: 10000
  ) {
    time
  }
}
```

#### Common Dropdown Patterns

```bql
mutation CommonDropdownPatterns {
  # Country/region selector
  countryRegionSelect: select(
    selector: "select[name='country'], select[name='region']"
    value: "US"
  ) {
    time
  }
  
  # Currency selector
  currencySelect: select(
    selector: "select[name='currency']"
    value: "USD"
    timeout: 10000
  ) {
    time
  }
  
  # Theme selector
  themeSelect: select(
    selector: "select#theme"
    value: "dark"
  ) {
    time
  }
  
  # Size selector
  sizeSelect: select(
    selector: "select[name='size']"
    value: "large"
  ) {
    time
  }
  
  # Color selector
  colorSelect: select(
    selector: "select.color-picker"
    value: "blue"
  ) {
    time
  }
}
```

#### Complex Selectors

```bql
mutation ComplexSelectors {
  # Attribute selector
  attributeSelect: select(
    selector: "select[data-type='attribute']"
    value: "attribute-value"
  ) {
    time
  }
  
  # Class and attribute combination
  classAttributeSelect: select(
    selector: "select.advanced[data-role='selection']"
    value: "class-attribute-value"
  ) {
    time
  }
  
  # Descendant selector
  descendantSelect: select(
    selector: ".container form select[name='descendant']"
    value: "descendant-value"
  ) {
    time
  }
  
  # Pseudo-class selector
  pseudoClassSelect: select(
    selector: "select:not([disabled])"
    value: "pseudo-class-value"
  ) {
    time
  }
}
```

#### Workflow Automation

```bql
mutation WorkflowAutomation {
  # Registration workflow
  registrationWorkflow: select(
    selector: "form#registration select[name='workflow-country']"
    value: "GB"
    visible: true
    timeout: 12000
  ) {
    time
  }
  
  # E-commerce workflow
  ecommerceWorkflow: select(
    selector: "form.checkout select[name='shipping-method']"
    value: "express"
    scroll: true
    timeout: 15000
  ) {
    time
  }
  
  # Survey workflow
  surveyWorkflow: select(
    selector: "form.survey select[name='satisfaction']"
    value: "very-satisfied"
    visible: true
  ) {
    time
  }
  
  # Profile setup workflow
  profileSetupWorkflow: select(
    selector: "form.profile-setup select[name='experience-level']"
    value: "expert"
    scroll: true
    wait: true
  ) {
    time
  }
}
```

#### Accessibility Features

```bql
mutation AccessibilityFeatures {
  # ARIA labeled select
  ariaLabeledSelect: select(
    selector: "select[aria-label='Accessibility Select']"
    value: "accessible-option"
    visible: true
  ) {
    time
  }
  
  # Screen reader friendly select
  screenReaderSelect: select(
    selector: "select[aria-describedby='select-help']"
    value: "screen-reader-option"
    timeout: 10000
  ) {
    time
  }
  
  # High contrast select
  highContrastSelect: select(
    selector: "select.high-contrast"
    value: "high-contrast-option"
    visible: true
  ) {
    time
  }
  
  # Keyboard accessible select
  keyboardAccessibleSelect: select(
    selector: "select[tabindex='0']"
    value: "keyboard-accessible-option"
    wait: true
  ) {
    time
  }
}
```

#### Select Parameters

- **timeout** (Float, optional): Wait time for element in milliseconds. Default: 30000
- **scroll** (Boolean, optional): Whether to scroll to select element. Default: true
- **selector** (String!, required): CSS selector of the select element
- **value** (StringOrArray!, required): Value or values to select from dropdown
- **visible** (Boolean, optional): Only select if element is visible. Default: false
- **wait** (Boolean, optional): Wait for select element in DOM. Default: true

#### SelectResponse Fields

- **time**: Time taken for the select operation in milliseconds

#### Select Benefits

- **🔽 Form Automation**: Automated dropdown selection for form completion workflows
- **📋 Multi-Selection**: Support for both single and multiple option selection
- **👁️ Visibility Control**: Conditional selection based on element visibility
- **⚡ Performance Control**: Flexible scroll, wait, and timeout behaviors
- **🎯 Precise Targeting**: CSS selector-based element targeting with form context awareness
- **⏱️ Timeout Management**: Configurable wait times for dynamic content loading
- **🔧 Workflow Integration**: Essential for automated testing and user interaction scenarios

#### Common Select Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **Basic Selection** | `selector: "select[name='field']", value: "option"` | Simple dropdown selection |
| **Multiple Selection** | `selector: "select[multiple]", value: ["option1", "option2"]` | Multi-option selection |
| **Conditional Selection** | `visible: true, timeout: 10000` | Select only if visible |
| **Fast Selection** | `wait: false, scroll: false` | Immediate selection without waiting |
| **Form Context** | `selector: "form select[name='field']"` | Form-specific dropdown selection |
| **Timeout Control** | `timeout: 15000` | Extended wait for slow-loading options |

#### Selection Strategies

- **Single Value**: Select individual options from standard dropdowns
- **Multiple Values**: Select multiple options from multi-select elements
- **Visibility-Based**: Conditional selection based on element visibility
- **Context-Aware**: Form and container-specific dropdown targeting

#### Timeout Recommendations

- **5000ms**: Fast static dropdowns
- **10000ms**: Standard dynamic content
- **15000ms**: Ajax-loaded options
- **30000ms**: Complex applications with slow networks

#### Scroll and Wait Behavior

- **scroll: true** (default): Scrolls to element before selection
- **scroll: false**: Selects without scrolling
- **wait: true** (default): Waits for element to appear in DOM
- **wait: false**: Attempts immediate selection
- **visible: true**: Only selects if element is visible
- **visible: false** (default): Selects regardless of visibility

#### Value Format Options

- **Single String**: `value: "option1"` for single selection
- **Array of Strings**: `value: ["option1", "option2"]` for multiple selection
- **Option Values**: Use the `value` attribute of option elements, not the display text

The select operation provides essential dropdown interaction capabilities for form automation, user workflow testing, data entry scenarios, and comprehensive web application interaction with both single and multiple selection support.

### setExtraHTTPHeaders Operation (setExtraHTTPHeaders)

Sets the HTTP headers for the page. Configures custom headers that will be sent with all subsequent requests, enabling authentication, content type control, security headers, and custom API integration for enhanced web automation workflows.

#### Basic setExtraHTTPHeaders Usage

```bql
mutation SetHTTPHeadersBasic {
  # Set basic authentication header
  setExtraHTTPHeaders(headers: [
    {name: "Authorization", value: "Bearer token123"}
    {name: "Content-Type", value: "application/json"}
  ]) {
    time
  }
  
  # Navigate with custom headers
  goto(url: "https://api.example.com") {
    status
  }
}
```

#### Authentication Headers

```bql
mutation AuthenticationHeaders {
  # JWT Bearer token authentication
  jwtAuthHeaders: setExtraHTTPHeaders(headers: [
    {name: "Authorization", value: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"}
    {name: "X-API-Key", value: "api-key-12345"}
    {name: "X-Client-Version", value: "1.0.0"}
  ]) {
    time
  }
  
  # API key authentication
  apiKeyHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-API-Key", value: "sk_test_12345abcdef"}
    {name: "X-API-Version", value: "2023-01-01"}
    {name: "X-Client-ID", value: "client-abc123"}
  ]) {
    time
  }
  
  # Session-based authentication
  sessionHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Session-Token", value: "session-token-xyz789"}
    {name: "X-Session-ID", value: "session-abc123"}
    {name: "X-User-ID", value: "user-456789"}
  ]) {
    time
  }
}
```

#### Security Headers

```bql
mutation SecurityHeaders {
  # CSRF protection headers
  csrfHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-CSRF-Token", value: "csrf-token-xyz123"}
    {name: "X-Requested-With", value: "XMLHttpRequest"}
    {name: "X-CSRF-Protection", value: "1"}
  ]) {
    time
  }
  
  # Frame protection headers
  frameProtectionHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Frame-Options", value: "DENY"}
    {name: "X-Content-Type-Options", value: "nosniff"}
    {name: "X-XSS-Protection", value: "1; mode=block"}
  ]) {
    time
  }
  
  # Content security headers
  contentSecurityHeaders: setExtraHTTPHeaders(headers: [
    {name: "Content-Security-Policy", value: "default-src 'self'"}
    {name: "Strict-Transport-Security", value: "max-age=31536000"}
    {name: "Referrer-Policy", value: "strict-origin-when-cross-origin"}
  ]) {
    time
  }
}
```

#### API Integration Headers

```bql
mutation APIIntegrationHeaders {
  # REST API headers
  restAPIHeaders: setExtraHTTPHeaders(headers: [
    {name: "Accept", value: "application/json"}
    {name: "Content-Type", value: "application/json"}
    {name: "X-HTTP-Method-Override", value: "PUT"}
    {name: "X-API-Version", value: "v1"}
  ]) {
    time
  }
  
  # GraphQL API headers
  graphqlHeaders: setExtraHTTPHeaders(headers: [
    {name: "Content-Type", value: "application/graphql"}
    {name: "Accept", value: "application/json"}
    {name: "X-GraphQL-Operation-Name", value: "GetUser"}
  ]) {
    time
  }
  
  # Microservices headers
  microservicesHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Service-Name", value: "user-service"}
    {name: "X-Service-Version", value: "v2.1.0"}
    {name: "X-Correlation-ID", value: "corr-abc123"}
    {name: "X-Request-ID", value: "req-xyz789"}
  ]) {
    time
  }
}
```

#### Localization and Encoding Headers

```bql
mutation LocalizationHeaders {
  # Language and locale headers
  localeHeaders: setExtraHTTPHeaders(headers: [
    {name: "Accept-Language", value: "en-US,en;q=0.9,es;q=0.8"}
    {name: "Accept-Charset", value: "utf-8, iso-8859-1;q=0.8"}
    {name: "X-Locale", value: "en_US"}
    {name: "X-Timezone", value: "America/New_York"}
  ]) {
    time
  }
  
  # Encoding headers
  encodingHeaders: setExtraHTTPHeaders(headers: [
    {name: "Accept-Encoding", value: "gzip, deflate, br"}
    {name: "Content-Encoding", value: "gzip"}
    {name: "Transfer-Encoding", value: "chunked"}
  ]) {
    time
  }
}
```

#### Caching Control Headers

```bql
mutation CachingHeaders {
  # No cache headers
  noCacheHeaders: setExtraHTTPHeaders(headers: [
    {name: "Cache-Control", value: "no-cache, no-store, must-revalidate"}
    {name: "Pragma", value: "no-cache"}
    {name: "Expires", value: "0"}
  ]) {
    time
  }
  
  # Cache control headers
  cacheControlHeaders: setExtraHTTPHeaders(headers: [
    {name: "Cache-Control", value: "public, max-age=3600"}
    {name: "ETag", value: "\"abc123-def456\""}
    {name: "Last-Modified", value: "Wed, 21 Oct 2015 07:28:00 GMT"}
  ]) {
    time
  }
}
```

#### CORS Headers

```bql
mutation CORSHeaders {
  # Basic CORS headers
  corsHeaders: setExtraHTTPHeaders(headers: [
    {name: "Access-Control-Allow-Origin", value: "*"}
    {name: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS"}
    {name: "Access-Control-Allow-Headers", value: "Content-Type, Authorization"}
  ]) {
    time
  }
  
  # Advanced CORS headers
  advancedCorsHeaders: setExtraHTTPHeaders(headers: [
    {name: "Access-Control-Allow-Origin", value: "https://trusted-domain.com"}
    {name: "Access-Control-Allow-Credentials", value: "true"}
    {name: "Access-Control-Expose-Headers", value: "X-Custom-Header"}
    {name: "Access-Control-Max-Age", value: "86400"}
  ]) {
    time
  }
}
```

#### Tracking and Analytics Headers

```bql
mutation TrackingHeaders {
  # User tracking headers
  userTrackingHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-User-ID", value: "user-123456"}
    {name: "X-Session-ID", value: "session-abc123"}
    {name: "X-Request-ID", value: "req-xyz789"}
    {name: "X-Trace-ID", value: "trace-def456"}
  ]) {
    time
  }
  
  # Analytics headers
  analyticsHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Analytics-ID", value: "analytics-abc123"}
    {name: "X-Analytics-Session", value: "session-xyz789"}
    {name: "X-Referrer", value: "https://search.google.com"}
    {name: "X-Campaign", value: "summer-sale-2024"}
  ]) {
    time
  }
}
```

#### E-commerce Headers

```bql
mutation EcommerceHeaders {
  # Shopping cart headers
  shoppingHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Shop-Domain", value: "example-shop.com"}
    {name: "X-Customer-Group", value: "premium"}
    {name: "X-Cart-ID", value: "cart-abc123"}
    {name: "X-Currency", value: "USD"}
  ]) {
    time
  }
  
  # Payment headers
  paymentHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Payment-Method", value: "credit_card"}
    {name: "X-Payment-Provider", value: "stripe"}
    {name: "X-Transaction-ID", value: "txn-xyz789"}
  ]) {
    time
  }
}
```

#### Testing and Debug Headers

```bql
mutation TestingHeaders {
  # Test environment headers
  testHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Test-Mode", value: "true"}
    {name: "X-Test-Suite", value: "integration"}
    {name: "X-Test-Run-ID", value: "run-12345"}
    {name: "X-Environment", value: "staging"}
  ]) {
    time
  }
  
  # Debug headers
  debugHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Debug-Mode", value: "verbose"}
    {name: "X-Debug-Level", value: "3"}
    {name: "X-Debug-Trace", value: "enabled"}
  ]) {
    time
  }
}
```

#### Mobile and Device Headers

```bql
mutation DeviceHeaders {
  # Mobile device headers
  mobileHeaders: setExtraHTTPHeaders(headers: [
    {name: "User-Agent", value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)"}
    {name: "X-Device-Type", value: "mobile"}
    {name: "X-Screen-Resolution", value: "375x812"}
    {name: "X-Platform", value: "iOS"}
  ]) {
    time
  }
  
  # Desktop headers
  desktopHeaders: setExtraHTTPHeaders(headers: [
    {name: "User-Agent", value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    {name: "X-Device-Type", value: "desktop"}
    {name: "X-Screen-Resolution", value: "1920x1080"}
    {name: "X-Browser", value: "Chrome"}
  ]) {
    time
  }
}
```

#### Workflow Integration

```bql
mutation WorkflowIntegration {
  # Set authentication headers
  authHeaders: setExtraHTTPHeaders(headers: [
    {name: "Authorization", value: "Bearer jwt-token-abc123"}
    {name: "X-API-Key", value: "api-key-xyz789"}
  ]) {
    time
  }
  
  # Set request headers
  requestHeaders: setExtraHTTPHeaders(headers: [
    {name: "Content-Type", value: "application/json"}
    {name: "Accept", value: "application/json"}
    {name: "User-Agent", value: "Custom-Bot/1.0"}
  ]) {
    time
  }
  
  # Set tracking headers
  trackingHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Session-ID", value: "session-abc123"}
    {name: "X-Request-ID", value: "req-xyz789"}
  ]) {
    time
  }
  
  # Navigate with all custom headers
  goto(url: "https://api.example.com") {
    status
  }
}
```

#### setExtraHTTPHeaders Parameters

- **headers** ([HeaderInput]!, required): Array of HTTP headers to set on the page
  - **name** (String!): Header name (e.g., "Authorization", "Content-Type")
  - **value** (String!): Header value (e.g., "Bearer token123", "application/json")

#### HTTPHeadersResponse Fields

- **time**: Time taken to set the HTTP headers in milliseconds

#### setExtraHTTPHeaders Benefits

- **🌐 API Integration**: Configure headers for REST, GraphQL, and microservices communication
- **🔐 Authentication**: Set authorization tokens, API keys, and session credentials
- **🛡️ Security**: Configure CSRF protection, frame options, and content security policies
- **🌍 Localization**: Set language, encoding, and timezone headers for international support
- **💾 Caching Control**: Manage cache behavior and conditional requests
- **🔀 CORS Support**: Configure cross-origin resource sharing headers
- **📊 Analytics**: Set tracking, user identification, and campaign headers
- **🛒 E-commerce**: Configure shopping, payment, and inventory-specific headers
- **🧪 Testing**: Set debug, environment, and test-specific headers
- **📱 Device Targeting**: Configure device-specific and platform headers

#### Common Header Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **API Authentication** | `Authorization: "Bearer token123"` | Authenticate API requests |
| **Content Type Control** | `Content-Type: "application/json"` | Specify request/response format |
| **CSRF Protection** | `X-CSRF-Token: "csrf-token-xyz"` | Prevent cross-site request forgery |
| **User Agent Override** | `User-Agent: "Custom-Bot/1.0"` | Identify application or bot |
| **Language Setting** | `Accept-Language: "en-US,en;q=0.9"` | Specify preferred languages |
| **Cache Control** | `Cache-Control: "no-cache"` | Control caching behavior |

#### Header Categories

- **Authentication**: Authorization, X-API-Key, X-Session-Token
- **Content**: Content-Type, Accept, Accept-Language, Accept-Encoding
- **Security**: X-CSRF-Token, X-Frame-Options, Content-Security-Policy
- **Tracking**: X-User-ID, X-Session-ID, X-Request-ID, X-Trace-ID
- **API**: X-API-Version, X-HTTP-Method-Override, X-GraphQL-Operation-Name
- **Custom**: X-App-Version, X-Environment, X-Feature-Flags

#### Best Practices

- **Set headers before navigation**: Call setExtraHTTPHeaders before goto operations
- **Use standard header names**: Follow HTTP header naming conventions
- **Secure sensitive data**: Use environment variables for tokens and secrets
- **Group related headers**: Set related headers together for better organization
- **Test header effects**: Verify headers are sent correctly using tools like httpbin.org

#### Header Persistence

Headers set with setExtraHTTPHeaders persist for all subsequent requests in the session until:
- New headers are set (which override previous ones)
- The browser session ends
- Headers are explicitly cleared

The setExtraHTTPHeaders operation provides essential HTTP header configuration capabilities for API integration, security enhancement, authentication management, and custom request/response handling in web automation workflows.

### solve Operation (solve) 🚨 **EXPERIMENTAL**

🚨 **EXPERIMENTAL OPERATION** 🚨 - This operation is experimental and subject to change. Use with caution in production environments.

Solves a captcha or other challenge, specified by the "type" of captcha to solve. The solve operation automatically detects and attempts to solve various types of protection challenges including hCaptcha and Cloudflare challenges.

#### Basic solve Usage

```bql
mutation SolveCaptchaBasic {
  # Navigate to protected page
  goto(url: "https://protected.domain") {
    status
  }
  
  # 🚨 EXPERIMENTAL: Solve hCaptcha challenge
  solve(type: hcaptcha) {
    found
    solved
    time
  }
}
```

#### hCaptcha Solving

```bql
mutation SolveHCaptcha {
  # Basic hCaptcha solving
  basicHCaptcha: solve(type: hcaptcha) {
    found
    solved
    time
  }
  
  # hCaptcha with timeout
  timeoutHCaptcha: solve(
    type: hcaptcha
    timeout: 30000
  ) {
    found
    solved
    time
  }
  
  # hCaptcha without waiting
  quickHCaptcha: solve(
    type: hcaptcha
    wait: false
  ) {
    found
    solved
    time
  }
}
```

#### Cloudflare Challenge Solving

```bql
mutation SolveCloudflare {
  # Basic Cloudflare challenge
  basicCloudflare: solve(type: cloudflare) {
    found
    solved
    time
  }
  
  # Cloudflare with extended timeout
  extendedCloudflare: solve(
    type: cloudflare
    timeout: 45000
    wait: true
  ) {
    found
    solved
    time
  }
  
  # Bot protection challenge
  botProtection: solve(
    type: cloudflare
    timeout: 40000
  ) {
    found
    solved
    time
  }
}
```

#### Authentication Workflow

```bql
mutation AuthenticationCaptcha {
  # Login form with captcha
  goto(url: "https://example.com/login") {
    status
  }
  
  # Fill login form
  type(selector: "input[name='username']", text: "user@example.com") {
    time
  }
  
  type(selector: "input[name='password']", text: "password123") {
    time
  }
  
  # Solve login captcha
  loginCaptcha: solve(
    type: hcaptcha
    timeout: 25000
    wait: true
  ) {
    found
    solved
    time
  }
  
  # Submit form after solving
  click(selector: "button[type='submit']") {
    selector
    time
  }
}
```

#### E-commerce Checkout Protection

```bql
mutation CheckoutCaptcha {
  # Navigate to checkout
  goto(url: "https://shop.example.com/checkout") {
    status
  }
  
  # Fill payment information
  type(selector: "input[name='card_number']", text: "4111111111111111") {
    time
  }
  
  # Solve checkout protection
  checkoutProtection: solve(
    type: hcaptcha
    timeout: 30000
  ) {
    found
    solved
    time
  }
  
  # Complete purchase
  click(selector: "button.complete-order") {
    selector
    time
  }
}
```

#### API Access Protection

```bql
mutation APICaptcha {
  # Access protected API endpoint
  goto(url: "https://api.example.com/protected") {
    status
  }
  
  # Solve API access challenge
  apiChallenge: solve(
    type: cloudflare
    timeout: 35000
    wait: true
  ) {
    found
    solved
    time
  }
  
  # Make API request after solving
  evaluate(content: "fetch('/api/data').then(r => r.json())") {
    value
  }
}
```

#### Multiple Attempt Strategy

```bql
mutation MultipleAttempts {
  # First attempt with standard timeout
  firstAttempt: solve(
    type: hcaptcha
    timeout: 15000
  ) {
    found
    solved
    time
  }
  
  # Retry with extended timeout if needed
  retryAttempt: solve(
    type: hcaptcha
    timeout: 45000
    wait: true
  ) {
    found
    solved
    time
  }
  
  # Final attempt with maximum timeout
  finalAttempt: solve(
    type: hcaptcha
    timeout: 60000
  ) {
    found
    solved
    time
  }
}
```

#### Bot Protection Scenarios

```bql
mutation BotProtection {
  # DDoS protection challenge
  ddosProtection: solve(
    type: cloudflare
    timeout: 40000
  ) {
    found
    solved
    time
  }
  
  # Advanced bot detection
  advancedBotDetection: solve(
    type: cloudflare
    timeout: 35000
    wait: true
  ) {
    found
    solved
    time
  }
  
  # Security challenge
  securityChallenge: solve(
    type: hcaptcha
    timeout: 30000
    wait: true
  ) {
    found
    solved
    time
  }
}
```

#### Content Access Protection

```bql
mutation ContentAccess {
  # Premium content protection
  premiumContent: solve(
    type: hcaptcha
    timeout: 20000
  ) {
    found
    solved
    time
  }
  
  # Download protection
  downloadProtection: solve(
    type: cloudflare
    timeout: 25000
  ) {
    found
    solved
    time
  }
  
  # Media access protection
  mediaAccess: solve(
    type: hcaptcha
    timeout: 18000
    wait: true
  ) {
    found
    solved
    time
  }
}
```

#### Performance Optimization

```bql
mutation PerformanceOptimized {
  # Fast captcha detection
  fastDetection: solve(
    type: hcaptcha
    timeout: 8000
  ) {
    found
    solved
    time
  }
  
  # Speed optimized (no wait)
  speedOptimized: solve(
    type: cloudflare
    timeout: 5000
    wait: false
  ) {
    found
    solved
    time
  }
  
  # Balanced approach
  balanced: solve(
    type: hcaptcha
    timeout: 20000
    wait: true
  ) {
    found
    solved
    time
  }
  
  # Accuracy focused
  accuracyFocused: solve(
    type: cloudflare
    timeout: 50000
    wait: true
  ) {
    found
    solved
    time
  }
}
```

#### Complex Workflow Integration

```bql
mutation ComplexWorkflow {
  # Navigate to protected page
  goto(url: "https://complex-app.example.com") {
    status
    url
  }
  
  # Detect initial challenge
  initialChallenge: solve(
    type: cloudflare
    timeout: 15000
    wait: true
  ) {
    found
    solved
    time
  }
  
  # Perform user actions
  click(selector: "button.start-process") {
    selector
    time
  }
  
  # Handle form captcha
  formCaptcha: solve(
    type: hcaptcha
    timeout: 25000
  ) {
    found
    solved
    time
  }
  
  # Continue workflow
  type(selector: "input[name='data']", text: "workflow data") {
    time
  }
  
  # Final submission captcha
  submissionCaptcha: solve(
    type: hcaptcha
    timeout: 30000
    wait: true
  ) {
    found
    solved
    time
  }
  
  # Complete process
  click(selector: "button.submit") {
    selector
    time
  }
  
  # Verify success
  verification: text(selector: "h1.success") {
    text
    time
  }
}
```

#### Edge Cases and Error Handling

```bql
mutation EdgeCases {
  # Minimal timeout test
  minimalTimeout: solve(
    type: hcaptcha
    timeout: 1000
    wait: false
  ) {
    found
    solved
    time
  }
  
  # No timeout specified (uses default)
  defaultTimeout: solve(
    type: cloudflare
    wait: true
  ) {
    found
    solved
    time
  }
  
  # Immediate check without waiting
  immediateCheck: solve(
    type: hcaptcha
    wait: false
  ) {
    found
    solved
    time
  }
}
```

#### solve Parameters

- **type** (CaptchaTypes!, required): The type of captcha to solve
  - `hcaptcha`: Solve hCaptcha challenges
  - `cloudflare`: Solve Cloudflare protection challenges
- **timeout** (Float, optional): Time in milliseconds to wait for captcha to appear. Only applies when `wait = true`. Default behavior varies by implementation
- **wait** (Boolean, optional): Whether to wait for captcha to be present on the page. Default: true

#### CaptchaResponse Fields

- **found**: Boolean indicating whether a captcha was found on the page
- **solved**: Boolean indicating whether the captcha was successfully solved
- **time**: Time taken to solve the captcha in milliseconds

#### solve Benefits

- **🧩 Automated Challenge Solving**: Automatically detect and solve captcha challenges
- **🛡️ Bot Protection Bypass**: Handle Cloudflare and other bot protection systems
- **🔐 Authentication Support**: Solve captchas in login and registration flows
- **🛒 E-commerce Integration**: Handle checkout and payment captcha challenges
- **📡 API Access**: Bypass API protection challenges
- **⚡ Performance Control**: Configurable timeouts and wait behaviors
- **🎯 Multi-Type Support**: Support for various captcha and challenge types
- **⏱️ Timeout Management**: Flexible timeout configuration for different scenarios

#### Common Captcha Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **Basic hCaptcha** | `type: hcaptcha` | Standard captcha solving |
| **Cloudflare Challenge** | `type: cloudflare` | Bot protection bypass |
| **Quick Detection** | `timeout: 5000, wait: false` | Fast captcha detection |
| **Extended Solving** | `timeout: 60000, wait: true` | Complex challenge solving |
| **Login Forms** | `type: hcaptcha, timeout: 25000` | Authentication captchas |
| **API Protection** | `type: cloudflare, timeout: 35000` | API access challenges |

#### Supported Challenge Types

- **hCaptcha**: Popular captcha service used for bot detection
- **Cloudflare**: Bot protection and DDoS mitigation challenges
- **Future Types**: Additional challenge types may be supported as the API evolves

#### Timeout Recommendations

- **5000ms**: Quick detection and fast challenges
- **15000ms**: Standard captcha solving
- **30000ms**: Complex challenges and slower networks
- **45000ms**: Extended solving for difficult captchas
- **60000ms**: Maximum timeout for persistent challenges

#### Wait Behavior

- **wait: true** (default): Waits for captcha to appear before attempting to solve
- **wait: false**: Attempts immediate solving without waiting for captcha detection
- **Timeout interaction**: When `wait = true`, timeout controls how long to wait for captcha appearance

#### Success Patterns

- **found: true, solved: true**: Captcha was found and successfully solved
- **found: true, solved: false**: Captcha was found but solving failed
- **found: false**: No captcha was detected on the page

#### Error Scenarios

- **Timeout exceeded**: Operation times out while waiting for captcha or during solving
- **Unsupported type**: Challenge type is not supported by the implementation
- **Network issues**: Connection problems during solving process

#### Integration Strategies

- **Pre-Navigation**: Detect challenges immediately after page load
- **Form Integration**: Solve captchas before form submission
- **API Workflow**: Handle challenges before making API requests
- **Multi-Step**: Solve multiple challenges in complex workflows
- **Retry Logic**: Implement multiple attempts with increasing timeouts

#### Performance Considerations

- **Timeout Selection**: Balance between speed and success rate
- **Wait Strategy**: Use `wait: false` for performance, `wait: true` for reliability
- **Multiple Attempts**: Implement progressive timeout strategy for better results
- **Resource Usage**: Solving challenges can be resource-intensive

#### Security and Legal Considerations

⚠️ **Important Notes**:
- Ensure compliance with website terms of service
- Respect rate limiting and anti-automation policies
- Use responsibly and ethically
- Consider legal implications in your jurisdiction
- This feature is experimental and behavior may change

#### Troubleshooting

Common issues and solutions:
- **Challenge not detected**: Increase timeout or ensure proper page load
- **Solving fails**: Try different timeout values or retry strategies
- **Timeout errors**: Increase timeout or check network connectivity
- **Unsupported challenge**: Verify challenge type is supported

🚨 **EXPERIMENTAL STATUS**: This operation is experimental and may change significantly in future versions. API stability is not guaranteed. Use with appropriate caution and testing in production environments.

The solve operation provides powerful captcha and challenge solving capabilities for automated workflows, but should be used responsibly and in compliance with applicable terms of service and legal requirements.

### text Operation (text)

Returns the text content on the given page or by selector when specified. The text operation provides comprehensive text extraction capabilities with support for element targeting, visibility filtering, timeout configuration, and text cleaning for LLM processing and content analysis.

#### Basic text Usage

```bql
mutation GetTextBasic {
  # Navigate to page
  goto(url: "https://example.com") {
    status
  }

  # Get specific element text
  selector: text(selector: "h1") {
    text
  }

  # Get full page text
  fullPage: text {
    text
  }
}
```

#### Element-Specific Text Extraction

```bql
mutation ElementText {
  # Heading text
  headingText: text(selector: "h1, h2, h3") {
    text
  }
  
  # Paragraph content
  paragraphText: text(selector: "p") {
    text
  }
  
  # Article content
  articleContent: text(selector: "article") {
    text
  }
  
  # Navigation text
  navigationText: text(selector: "nav a") {
    text
  }
  
  # Link text
  linkText: text(selector: "a") {
    text
  }
  
  # Button text
  buttonText: text(selector: "button") {
    text
  }
}
```

#### Timeout Configuration

```bql
mutation TimeoutText {
  # Quick text extraction
  quickText: text(
    selector: ".quick-content"
    timeout: 5000
  ) {
    text
  }
  
  # Standard timeout
  standardText: text(
    selector: ".content"
    timeout: 15000
  ) {
    text
  }
  
  # Extended timeout for slow content
  slowText: text(
    selector: ".slow-loading"
    timeout: 30000
  ) {
    text
  }
  
  # Dynamic content with long timeout
  dynamicText: text(
    selector: ".ajax-content"
    timeout: 45000
  ) {
    text
  }
}
```

#### Visibility-Based Text Extraction

```bql
mutation VisibilityText {
  # Visible elements only
  visibleText: text(
    selector: ".content"
    visible: true
  ) {
    text
  }
  
  # All elements regardless of visibility
  allText: text(
    selector: ".content"
    visible: false
  ) {
    text
  }
  
  # Visible navigation with timeout
  visibleNav: text(
    selector: "nav a"
    visible: true
    timeout: 10000
  ) {
    text
  }
  
  # Visible error messages
  visibleErrors: text(
    selector: ".error, .alert"
    visible: true
    timeout: 5000
  ) {
    text
  }
}
```

#### Text Cleaning for LLM Processing

```bql
mutation CleanedText {
  # Basic text cleaning
  cleanedBasic: text(
    selector: "article"
    clean: {
      removeNonTextNodes: true
    }
  ) {
    text
  }
  
  # Remove extra whitespace
  cleanedWhitespace: text(
    selector: ".content"
    clean: {
      removeExtraWhitespace: true
    }
  ) {
    text
  }
  
  # Limit text length
  limitedText: text(
    selector: "article"
    clean: {
      maxLength: 500
    }
  ) {
    text
  }
  
  # Comprehensive cleaning for LLM
  llmText: text(
    selector: "article"
    clean: {
      removeNonTextNodes: true
      removeExtraWhitespace: true
      maxLength: 1000
    }
  ) {
    text
  }
  
  # Clean for summarization
  summaryText: text(
    selector: ".main-content"
    clean: {
      removeNonTextNodes: true
      removeExtraWhitespace: true
      maxLength: 2000
    }
  ) {
    text
  }
}
```

#### Content-Specific Extraction

```bql
mutation ContentSpecific {
  # Main content areas
  mainContent: text(selector: "main, .main, .content") {
    text
  }
  
  # Header content
  headerContent: text(selector: "header") {
    text
  }
  
  # Footer content
  footerContent: text(selector: "footer") {
    text
  }
  
  # Sidebar content
  sidebarContent: text(selector: ".sidebar, aside") {
    text
  }
  
  # Menu content
  menuContent: text(selector: ".menu, .nav-menu") {
    text
  }
}
```

#### Table and List Content

```bql
mutation StructuredContent {
  # Table headers
  tableHeaders: text(selector: "th") {
    text
  }
  
  # Table cells
  tableCells: text(selector: "td") {
    text
  }
  
  # Entire table content
  tableContent: text(selector: "table") {
    text
  }
  
  # List items
  listItems: text(selector: "ul li, ol li") {
    text
  }
  
  # Definition lists
  definitionList: text(selector: "dl dt, dl dd") {
    text
  }
  
  # Specific price data
  priceData: text(selector: "td.price, .price") {
    text
  }
}
```

#### Form and Interactive Content

```bql
mutation FormContent {
  # Form labels
  formLabels: text(selector: "form label") {
    text
  }
  
  # Error messages
  errorMessages: text(
    selector: ".error, .alert-error"
    visible: true
  ) {
    text
  }
  
  # Success messages
  successMessages: text(
    selector: ".success, .alert-success"
    visible: true
  ) {
    text
  }
  
  # Help text
  helpText: text(selector: ".help-text, .hint") {
    text
  }
  
  # Input placeholder text
  placeholderText: text(selector: "input[placeholder]") {
    text
  }
}
```

#### Dynamic Content Extraction

```bql
mutation DynamicContent {
  # AJAX loaded content
  ajaxContent: text(
    selector: ".ajax-content"
    timeout: 20000
    visible: true
  ) {
    text
  }
  
  # JavaScript generated content
  jsContent: text(
    selector: ".js-generated"
    timeout: 15000
  ) {
    text
  }
  
  # Modal content
  modalContent: text(
    selector: ".modal-body"
    visible: true
    timeout: 10000
  ) {
    text
  }
  
  # Tooltip text
  tooltipText: text(
    selector: ".tooltip"
    visible: true
    timeout: 5000
  ) {
    text
  }
}
```

#### Data Extraction Patterns

```bql
mutation DataExtraction {
  # Price information
  priceInfo: text(selector: ".price") {
    text
  }
  
  # Date information
  dateInfo: text(selector: ".date, time") {
    text
  }
  
  # Author information
  authorInfo: text(selector: ".author, .by-author") {
    text
  }
  
  # Title information
  titleInfo: text(selector: ".title, h1") {
    text
  }
  
  # Description text
  descriptionText: text(selector: ".description, .summary") {
    text
  }
}
```

#### Complex Selector Patterns

```bql
mutation ComplexSelectors {
  # CSS selector combinations
  complexSelector: text(selector: "article p:first-child") {
    text
  }
  
  # Multiple class selector
  multiClassText: text(selector: ".primary.highlighted") {
    text
  }
  
  # Attribute selector
  attributeText: text(selector: "div[data-content]") {
    text
  }
  
  # Pseudo-class selector
  pseudoClassText: text(selector: "li:nth-child(odd)") {
    text
  }
  
  # Multiple element types
  multipleElements: text(selector: "p, div.content, span.text") {
    text
  }
}
```

#### SEO and Meta Content

```bql
mutation SEOContent {
  # Page title
  pageTitle: text(selector: "title") {
    text
  }
  
  # Breadcrumb navigation
  breadcrumbs: text(selector: ".breadcrumb") {
    text
  }
  
  # Schema markup text
  schemaText: text(selector: "[itemtype]") {
    text
  }
  
  # Meta description (if rendered)
  metaDescription: text(selector: "meta[name='description']") {
    text
  }
}
```

#### Performance Optimization

```bql
mutation PerformanceText {
  # Fast text extraction
  fastText: text(
    selector: ".fast-content"
    timeout: 3000
  ) {
    text
  }
  
  # Large content with length limit
  largeContent: text(
    selector: ".large-content"
    timeout: 25000
    clean: {
      maxLength: 5000
    }
  ) {
    text
  }
  
  # Optimized for speed
  speedOptimized: text(
    selector: ".content"
    timeout: 5000
    visible: false
  ) {
    text
  }
}
```

#### Advanced Text Cleaning

```bql
mutation AdvancedCleaning {
  # Clean for search indexing
  searchIndexText: text(
    selector: "article"
    clean: {
      removeNonTextNodes: true
      removeExtraWhitespace: true
      maxLength: 3000
    }
  ) {
    text
  }
  
  # Clean for AI processing
  aiProcessingText: text(
    selector: ".content"
    clean: {
      removeNonTextNodes: true
      removeExtraWhitespace: true
      maxLength: 1500
    }
  ) {
    text
  }
  
  # Clean for mobile display
  mobileText: text(
    selector: ".mobile-content"
    clean: {
      removeExtraWhitespace: true
      maxLength: 800
    }
  ) {
    text
  }
}
```

#### Complete Text Workflow

```bql
mutation TextWorkflow {
  # Navigate to page
  goto(url: "https://example.com") {
    status
  }
  
  # Get page title
  pageTitle: text(selector: "h1, title") {
    text
  }
  
  # Get main content
  mainContent: text(
    selector: ".content, main, article"
    visible: true
    timeout: 15000
  ) {
    text
  }
  
  # Get cleaned content for processing
  cleanedContent: text(
    selector: "article"
    clean: {
      removeNonTextNodes: true
      removeExtraWhitespace: true
      maxLength: 2000
    }
  ) {
    text
  }
  
  # Get specific data points
  priceData: text(selector: ".price") {
    text
  }
  
  # Get author information
  authorInfo: text(selector: ".author") {
    text
  }
  
  # Get publication date
  dateInfo: text(selector: ".date, time") {
    text
  }
  
  # Get navigation text
  navigationText: text(
    selector: "nav a"
    visible: true
  ) {
    text
  }
}
```

#### text Parameters

- **timeout** (Float, optional): The maximum amount of time, in milliseconds, to wait for the selector to appear, overriding any defaults. Default timeout is 30 seconds, or 30000
- **selector** (String, optional): The DOM selector of the given element you want to return the text of
- **visible** (Boolean, optional): Whether or not to return the text content of the element only if it's visible. Default: false
- **clean** (CleanInput, optional): Specifies conditions for "cleaning" the returned text, useful for minimizing the amount of markup returned for cases like LLMs and more. See nested options for parameters:
  - **removeNonTextNodes** (Boolean): Remove non-text DOM nodes
  - **removeExtraWhitespace** (Boolean): Collapse multiple whitespace characters
  - **maxLength** (Int): Maximum character length of returned text

#### TextResponse Fields

- **text**: String containing the text content of the page or selected element

#### text Benefits

- **📝 Comprehensive Text Extraction**: Extract text from entire pages or specific elements
- **🎯 Precise Element Targeting**: Use CSS selectors for accurate content selection
- **👁️ Visibility Filtering**: Extract only visible content when needed
- **⏱️ Timeout Management**: Configurable wait times for dynamic content
- **🧹 Text Cleaning**: Advanced cleaning options for LLM processing and analysis
- **🚀 Performance Control**: Optimized extraction with length limits and fast timeouts
- **📊 Data Processing**: Structured text extraction for analysis and automation
- **🔍 Content Analysis**: Support for SEO, accessibility, and content auditing

#### Common Text Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **Basic Element Text** | `selector: "h1"` | Get heading text |
| **Full Page Text** | No selector | Extract all page text |
| **Visible Content Only** | `visible: true` | Get only visible text |
| **Timeout Control** | `timeout: 15000` | Wait for dynamic content |
| **Cleaned for LLM** | `clean: {removeNonTextNodes: true, maxLength: 1000}` | AI processing |
| **Content Analysis** | `clean: {removeExtraWhitespace: true, maxLength: 2000}` | Text analysis |

#### Text Extraction Strategies

- **Element-Specific**: Target specific HTML elements (h1, p, article, etc.)
- **Content Areas**: Extract from main content, sidebar, header, footer sections
- **Visibility-Based**: Get only visible content for accurate user-facing text
- **Structured Data**: Extract from tables, lists, and form elements
- **Dynamic Content**: Handle AJAX-loaded and JavaScript-generated content

#### Timeout Recommendations

- **3000ms**: Fast static content extraction
- **5000ms**: Quick dynamic content
- **15000ms**: Standard AJAX content
- **30000ms**: Complex dynamic applications
- **45000ms**: Slow-loading or heavy content

#### Text Cleaning Use Cases

- **LLM Processing**: Remove markup, limit length for AI model input
- **Search Indexing**: Clean text for search engine optimization
- **Content Analysis**: Normalize text for analysis and comparison
- **Mobile Display**: Truncate content for mobile interfaces
- **Data Extraction**: Clean specific data points for processing

#### Visibility Control

- **visible: true**: Only extract text from elements that are currently visible to users
- **visible: false** (default): Extract text from all matching elements regardless of visibility
- **Timeout interaction**: When `visible: true`, timeout applies to waiting for visible elements

#### Performance Considerations

- **Selector Specificity**: More specific selectors perform better than broad ones
- **Text Cleaning**: Cleaning operations add processing time but improve usability
- **Length Limits**: Use `maxLength` to prevent memory issues with large content
- **Timeout Balance**: Balance between reliability and performance

#### Error Handling

- **Non-existent selectors**: Returns empty text for elements that don't exist
- **Hidden elements**: Behavior depends on `visible` parameter setting
- **Timeout exceeded**: Operation fails if element doesn't appear within timeout
- **Empty content**: Returns empty string for elements with no text content

#### Integration Patterns

- **Content Auditing**: Extract text for SEO and accessibility analysis
- **Data Scraping**: Structured text extraction for data processing
- **Testing Verification**: Validate content in automated testing workflows
- **AI Integration**: Cleaned text extraction for machine learning processing
- **Report Generation**: Extract content for documentation and reporting

The text operation provides essential text extraction capabilities for content analysis, data processing, AI integration, and comprehensive web automation workflows with advanced cleaning and filtering options.

### title Operation (title)

Returns the title of the page that the browser is currently at. The title operation provides simple and reliable page title extraction for identification, verification, and SEO analysis workflows.

#### Basic title Usage

```bql
mutation GetTitle {
  # Simple title extraction
  title {
    title
  }
}
```

#### Navigation with Title

```bql
mutation NavigateAndGetTitle {
  # Navigate to page
  goto(url: "https://example.com") {
    status
  }

  # Get page title
  pageTitle: title {
    title
  }
}
```

#### Title Verification Workflow

```bql
mutation TitleVerification {
  # Navigate to page
  goto(url: "https://example.com") {
    status
  }

  # Get page title
  pageTitle: title {
    title
  }

  # Verify title contains expected text
  if(expression: "pageTitle.title.includes('Expected Text')") {
    verify(expression: "true") {
      success
    }
  }
}
```

#### Title Comparison

```bql
mutation TitleComparison {
  # Compare titles between pages
  goto(url: "https://page1.com") {
    status
  }

  firstTitle: title {
    title
  }

  goto(url: "https://page2.com") {
    status
  }

  secondTitle: title {
    title
  }

  # Compare results
  if(expression: "firstTitle.title !== secondTitle.title") {
    verify(expression: "true") {
      success
    }
  }
}
```

#### SEO Title Analysis

```bql
mutation SEOTitleAnalysis {
  # Navigate to page
  goto(url: "https://example.com") {
    status
  }

  # Get page title
  pageTitle: title {
    title
  }

  # Analyze title characteristics
  titleAnalysis: evaluate(expression: `
    const title = document.title;
    return {
      length: title.length,
      wordCount: title.split(' ').length,
      isOptimalLength: title.length >= 30 && title.length <= 60,
      hasNumbers: /\\d/.test(title),
      hasSpecialChars: /[^a-zA-Z0-9\\s]/.test(title),
      isEmpty: title.trim() === '',
      isUnique: !title.toLowerCase().includes('untitled')
    };
  `) {
    result
  }

  # Check if title contains keywords
  hasKeywords: evaluate(expression: "document.title.toLowerCase().includes('keyword')") {
    result
  }
}
```

#### Title Monitoring During Navigation

```bql
mutation TitleMonitoring {
  # Monitor title changes across navigation
  goto(url: "https://page1.com") {
    status
  }

  page1Title: title {
    title
  }

  # Navigate to different section
  click(selector: "a[href*='section']") {
    clicked
  }

  sectionTitle: title {
    title
  }

  # Back navigation
  back {
    status
  }

  backTitle: title {
    title
  }
}
```

#### Dynamic Title Testing

```bql
mutation DynamicTitleTest {
  # Test title changes during interactions
  goto(url: "https://example.com") {
    status
  }

  initialTitle: title {
    title
  }

  # Perform action that might change title
  click(selector: ".change-title-btn") {
    clicked
  }

  # Check if title changed
  updatedTitle: title {
    title
  }

  # Verify title change
  if(expression: "initialTitle.title !== updatedTitle.title") {
    verify(expression: "true") {
      success
    }
  }
}
```

#### Metadata Extraction with Title

```bql
mutation MetadataExtraction {
  # Extract page title and metadata
  goto(url: "https://example.com") {
    status
    url
  }

  # Get page title
  pageTitle: title {
    title
  }

  # Get additional metadata
  metaDescription: text(selector: "meta[name='description']") {
    text
  }

  # Get canonical URL
  canonical: text(selector: "link[rel='canonical']") {
    text
  }

  # Get Open Graph title
  ogTitle: text(selector: "meta[property='og:title']") {
    text
  }
}
```

#### E-commerce Title Workflow

```bql
mutation EcommerceTitleFlow {
  # Product page title extraction
  goto(url: "https://shop.example.com/product/123") {
    status
  }

  productPageTitle: title {
    title
  }

  # Add to cart
  click(selector: ".add-to-cart") {
    clicked
  }

  cartTitle: title {
    title
  }

  # Proceed to checkout
  click(selector: ".checkout-btn") {
    clicked
  }

  checkoutTitle: title {
    title
  }

  # Complete purchase
  click(selector: ".complete-order") {
    clicked
  }

  confirmationTitle: title {
    title
  }
}
```

#### Content Management Title Workflow

```bql
mutation ContentManagementTitles {
  # Login to CMS
  goto(url: "https://cms.example.com/login") {
    status
  }

  type(selector: "input[name='username']", text: "admin") {
    time
  }

  type(selector: "input[name='password']", text: "password") {
    time
  }

  click(selector: "button[type='submit']") {
    clicked
  }

  # Navigate to page editor
  click(selector: "a[href='/edit-page']") {
    clicked
  }

  editorTitle: title {
    title
  }

  # Edit page title
  type(selector: "input[name='page-title']", text: "New Page Title") {
    time
  }

  # Save changes
  click(selector: ".save-btn") {
    clicked
  }

  # Preview page
  click(selector: ".preview-btn") {
    clicked
  }

  previewTitle: title {
    title
  }

  # Publish page
  click(selector: ".publish-btn") {
    clicked
  }

  publishedTitle: title {
    title
  }
}
```

#### Multi-Page Title Analysis

```bql
mutation MultiPageTitleAnalysis {
  # Analyze titles across multiple pages
  goto(url: "https://page1.example.com") {
    status
  }

  page1Title: title {
    title
  }

  goto(url: "https://page2.example.com") {
    status
  }

  page2Title: title {
    title
  }

  goto(url: "https://page3.example.com") {
    status
  }

  page3Title: title {
    title
  }

  # Compare all titles
  titleComparison: evaluate(expression: `
    const titles = [
      page1Title.title,
      page2Title.title,
      page3Title.title
    ];
    return {
      allUnique: new Set(titles).size === titles.length,
      averageLength: titles.reduce((sum, t) => sum + t.length, 0) / titles.length,
      totalTitles: titles.length,
      longestTitle: Math.max(...titles.map(t => t.length)),
      shortestTitle: Math.min(...titles.map(t => t.length))
    };
  `) {
    result
  }
}
```

#### title Parameters

- None (this operation takes no arguments)

#### TitleResponse Fields

- **title**: String containing the title of the current page

#### title Benefits

- **📄 Simple Page Identification**: Quickly identify the current page
- **🔍 SEO Analysis**: Analyze title length, keywords, and optimization
- **✅ Page Verification**: Confirm correct page navigation
- **📊 Navigation Monitoring**: Track title changes during user flows
- **🎯 Content Management**: Validate page titles in CMS workflows
- **📈 A/B Testing**: Compare titles across different page variants
- **🔄 Dynamic Testing**: Test title changes during interactions
- **📝 Metadata Extraction**: Combine with other operations for complete page analysis

#### Common Title Scenarios

| Scenario | Use Case | Implementation |
|----------|----------|----------------|
| **Basic Extraction** | Get current page title | `title { title }` |
| **Navigation Verification** | Confirm page after navigation | `goto() + title` |
| **SEO Analysis** | Check title length and keywords | `title + evaluate()` |
| **Title Comparison** | Compare titles between pages | Multiple `title` operations |
| **Dynamic Testing** | Test title changes | `title` before/after interactions |
| **Metadata Collection** | Gather page metadata | `title + text()` combinations |

#### Title Analysis Strategies

- **Length Optimization**: Check if title is 30-60 characters for SEO
- **Keyword Presence**: Verify important keywords are included
- **Uniqueness**: Ensure titles are unique across pages
- **Brand Consistency**: Check for consistent branding patterns
- **Dynamic Validation**: Verify titles change appropriately during interactions

#### SEO Title Guidelines

- **Optimal Length**: 30-60 characters for search engine display
- **Keyword Placement**: Important keywords should appear early
- **Brand Inclusion**: Include brand name for recognition
- **Uniqueness**: Each page should have a unique, descriptive title
- **Accuracy**: Title should accurately describe page content

#### Integration Patterns

- **Page Auditing**: Combine with text() and screenshot() for complete page analysis
- **Navigation Testing**: Verify titles during automated navigation flows
- **Content Management**: Validate titles in CMS publishing workflows
- **SEO Monitoring**: Track title changes across site updates
- **A/B Testing**: Compare title effectiveness across variants

#### Error Handling

- **Empty Titles**: Returns empty string if no title is set
- **Dynamic Titles**: Captures title at time of operation execution
- **JavaScript Titles**: Handles titles set by JavaScript
- **Special Characters**: Preserves all characters including Unicode

#### Performance Characteristics

- **Fast Execution**: Instant operation with no network delays
- **Minimal Overhead**: Lightweight operation with no DOM traversal
- **Real-time Capture**: Gets current title state immediately
- **Memory Efficient**: Returns only the title string

The title operation provides essential page identification capabilities for SEO analysis, navigation verification, content management, and comprehensive web automation workflows.

### type Operation (type)

Types text into an element by scrolling to it, clicking it, then emitting key events for every character. The type operation provides realistic human-like typing simulation with configurable delays, interaction validation, and comprehensive form input capabilities.

#### Basic type Usage

```bql
mutation BasicTyping {
  # Simple text input
  type(
    selector: "input[type='text']"
    text: "Hello, World!"
  ) {
    time
  }
}
```

#### Form Field Typing

```bql
mutation FormTyping {
  # Navigate to form page
  goto(url: "https://example.com/form") {
    status
  }

  # Email field
  emailInput: type(
    selector: "input[type='email']"
    text: "user@example.com"
  ) {
    time
  }

  # Password field
  passwordInput: type(
    selector: "input[type='password']"
    text: "SecurePassword123!"
  ) {
    time
  }

  # Textarea field
  messageInput: type(
    selector: "textarea[name='message']"
    text: "This is a longer message with multiple sentences."
    delay: [40, 120]
  ) {
    time
  }
}
```

#### Realistic Human-Like Typing

```bql
mutation HumanLikeTyping {
  # Fast typing (minimal delay)
  fastTyping: type(
    selector: "input.fast"
    text: "quick typing"
    delay: [10, 30]
  ) {
    time
  }

  # Standard typing (natural pace)
  standardTyping: type(
    selector: "input.standard"
    text: "normal typing speed"
    delay: [50, 150]
  ) {
    time
  }

  # Slow typing (deliberate pace)
  slowTyping: type(
    selector: "input.slow"
    text: "careful deliberate typing"
    delay: [100, 300]
  ) {
    time
  }
}
```

#### Visibility and Interaction Control

```bql
mutation AdvancedTyping {
  # Type only if element is visible
  visibleTyping: type(
    selector: "input.visible-field"
    text: "visible only"
    visible: true
    timeout: 10000
  ) {
    time
  }

  # Type without scrolling to element
  noScrollTyping: type(
    selector: "input.no-scroll"
    text: "no scrolling"
    scroll: false
  ) {
    time
  }

  # Type without interaction check
  forceTyping: type(
    selector: "input.force"
    text: "force typing"
    interactable: false
  ) {
    time
  }

  # Type immediately without waiting
  immediateTyping: type(
    selector: "input.immediate"
    text: "immediate"
    wait: false
  ) {
    time
  }
}
```

#### Login Form Workflow

```bql
mutation LoginWorkflow {
  # Navigate to login page
  goto(url: "https://example.com/login") {
    status
  }

  # Username input with realistic typing
  usernameInput: type(
    selector: "input[name='username']"
    text: "testuser123"
    delay: [50, 150]
    visible: true
  ) {
    time
  }

  # Password input with slightly different timing
  passwordInput: type(
    selector: "input[name='password']"
    text: "SecurePass123!"
    delay: [40, 120]
    visible: true
  ) {
    time
  }

  # Submit login
  click(selector: "button[type='submit']") {
    clicked
  }
}
```

#### E-commerce Checkout Workflow

```bql
mutation CheckoutWorkflow {
  # Navigate to checkout
  goto(url: "https://shop.example.com/checkout") {
    status
  }

  # Billing information
  billingName: type(
    selector: "input[name='billing_name']"
    text: "John Doe"
    delay: [60, 180]
  ) {
    time
  }

  billingAddress: type(
    selector: "input[name='billing_address']"
    text: "123 Main Street"
    delay: [50, 150]
  ) {
    time
  }

  # Credit card information
  cardNumber: type(
    selector: "input[name='card_number']"
    text: "4111111111111111"
    delay: [70, 140]
  ) {
    time
  }

  cardExpiry: type(
    selector: "input[name='card_expiry']"
    text: "12/25"
    delay: [50, 150]
  ) {
    time
  }
}
```

#### Contact Form Workflow

```bql
mutation ContactFormWorkflow {
  # Navigate to contact page
  goto(url: "https://example.com/contact") {
    status
  }

  # Personal information
  contactName: type(
    selector: "input[name='name']"
    text: "Contact Person"
    delay: [60, 180]
  ) {
    time
  }

  contactEmail: type(
    selector: "input[name='email']"
    text: "contact@example.com"
    delay: [45, 135]
  ) {
    time
  }

  # Subject and message
  contactSubject: type(
    selector: "input[name='subject']"
    text: "Inquiry about services"
    delay: [50, 150]
  ) {
    time
  }

  contactMessage: type(
    selector: "textarea[name='message']"
    text: "I would like to inquire about your services and get more information about pricing and availability."
    delay: [35, 105]
    timeout: 30000
  ) {
    time
  }

  # Submit contact form
  click(selector: "button[type='submit']") {
    clicked
  }
}
```

#### Dynamic Content Typing

```bql
mutation DynamicTyping {
  # Type in AJAX-loaded content
  ajaxInput: type(
    selector: ".ajax-loaded-input"
    text: "AJAX loaded content"
    timeout: 20000
    wait: true
    visible: true
  ) {
    time
  }

  # Type in modal form
  modalInput: type(
    selector: ".modal input[name='modal_field']"
    text: "modal form data"
    visible: true
    timeout: 15000
    delay: [50, 150]
  ) {
    time
  }
}
```

#### Search Workflow

```bql
mutation SearchWorkflow {
  # Navigate to search page
  goto(url: "https://example.com") {
    status
  }

  # Clear existing search
  click(selector: ".search-clear") {
    clicked
  }

  # Type search query
  searchInput: type(
    selector: "input[type='search']"
    text: "product search query"
    delay: [50, 150]
    visible: true
  ) {
    time
  }

  # Submit search
  click(selector: "button[type='submit']") {
    clicked
  }
}
```

#### Complete Type Configuration

```bql
mutation CompleteTypeConfiguration {
  # Type with all options configured
  completeInput: type(
    selector: "input[name='complete']"
    text: "complete configuration example"
    delay: [50, 200]
    timeout: 30000
    visible: false
    scroll: true
    wait: true
    interactable: true
  ) {
    time
  }
}
```

#### type Parameters

- **text** (String!, required): The text content you want to type into the element
- **selector** (String!, required): The CSS selector of the element on the page you want to type text into
- **delay** ([Int], optional): The amount of delay between keystrokes in milliseconds. Values are used as a range and chosen at random (default: [50, 200])
- **interactable** (Boolean, optional): Whether or not to check if element can be interacted with by hovering over it and seeing if the element is available at that x and y position (default: true)
- **scroll** (Boolean, optional): Whether or not to scroll to the element prior to typing (default: true)
- **timeout** (Float, optional): How long to wait for the element to appear before timing out, overriding any defaults (default: 30000)
- **visible** (Boolean, optional): Whether or not to type into the element only if it's visible (default: false)
- **wait** (Boolean, optional): Whether or not to wait for the element to present in the DOM (default: true)

#### TypeResponse Fields

- **time**: Float containing the time taken to complete the typing operation in milliseconds

#### type Benefits

- **⌨️ Realistic Human Typing**: Simulates natural human typing patterns with randomized delays
- **🎯 Precise Element Targeting**: Uses CSS selectors for accurate input field identification
- **👁️ Visibility Control**: Optional typing only when elements are visible to users
- **📜 Smart Scrolling**: Automatically scrolls to elements before typing
- **🔍 Interaction Validation**: Verifies elements can be interacted with before typing
- **⏱️ Timeout Management**: Configurable wait times for dynamic form elements
- **🚀 Performance Control**: Adjustable typing speeds from fast automation to slow deliberate input
- **📝 Form Automation**: Complete form filling capabilities for authentication, e-commerce, and contact forms

#### Common Type Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **Basic Input** | `text: "value", selector: "input"` | Simple form field input |
| **Fast Typing** | `delay: [10, 30]` | Quick automation scenarios |
| **Human-Like** | `delay: [50, 150]` | Realistic user simulation |
| **Slow Deliberate** | `delay: [100, 300]` | Careful form completion |
| **Visible Only** | `visible: true` | Type only in visible fields |
| **No Scroll** | `scroll: false` | Skip scrolling behavior |
| **Force Type** | `interactable: false` | Override interaction checks |
| **Dynamic Content** | `timeout: 20000, wait: true` | AJAX-loaded forms |

#### Typing Speed Strategies

- **Fast Automation**: 10-30ms delays for rapid form completion
- **Standard Typing**: 50-150ms delays for normal user simulation
- **Deliberate Typing**: 100-300ms delays for careful input validation
- **Variable Timing**: Random delays within range for natural typing patterns

#### Delay Range Guidelines

- **[5, 15]**: Ultra-fast automation (testing only)
- **[25, 75]**: Fast but realistic typing
- **[50, 150]**: Standard human typing speed
- **[100, 300]**: Slow, deliberate typing
- **[40, 120]**: Varied natural typing

#### Element Targeting

- **Form Fields**: `input[type='text']`, `input[name='field']`, `textarea`
- **Email Fields**: `input[type='email']`, `input[name='email']`
- **Password Fields**: `input[type='password']`, `input[name='password']`
- **Search Fields**: `input[type='search']`, `.search-input`
- **Dynamic Elements**: `.ajax-loaded`, `.modal input`

#### Timeout Recommendations

- **5000ms**: Quick static forms
- **10000ms**: Standard form fields with basic validation
- **15000ms**: Modal and popup forms
- **20000ms**: AJAX-loaded dynamic content
- **30000ms**: Complex forms with heavy JavaScript

#### Interaction Control

- **interactable: true** (default): Verify element can receive input
- **interactable: false**: Force typing regardless of element state
- **visible: true**: Only type if element is visible to users
- **visible: false** (default): Type regardless of visibility
- **scroll: true** (default): Scroll to element before typing
- **scroll: false**: Skip scrolling behavior

#### Error Handling

- **Non-existent selectors**: Operation times out if element not found
- **Non-interactable elements**: Behavior depends on `interactable` parameter
- **Hidden elements**: Behavior depends on `visible` parameter setting
- **Timeout exceeded**: Operation fails if element doesn't appear within timeout

#### Performance Considerations

- **Delay settings**: Shorter delays increase speed but reduce realism
- **Selector specificity**: More specific selectors perform better
- **Timeout balance**: Balance between reliability and performance
- **Wait configuration**: Optimize based on element availability

#### Integration Patterns

- **Form Automation**: Complete form filling workflows for registration, checkout, contact
- **Authentication**: Login and registration form completion
- **Search Operations**: Search query input with natural typing patterns
- **Testing Workflows**: User input simulation for comprehensive testing
- **E-commerce**: Product search, checkout, and customer information entry

The type operation provides essential text input capabilities for form automation, user simulation, authentication workflows, and comprehensive web interaction automation with realistic human-like typing patterns.

### url Operation (url)

Returns the URL of the page that the browser is currently at. The url operation provides essential URL extraction capabilities for navigation tracking, verification workflows, and comprehensive site analysis.

#### Basic url Usage

```bql
mutation BasicURL {
  # Get current page URL
  currentURL: url {
    url
  }
}
```

#### Navigation Verification

```bql
mutation NavigationVerification {
  # Navigate to target page
  goto(url: "https://example.com") {
    status
  }

  # Verify current URL
  verifyURL: url {
    url
  }

  # Navigate to another page
  goto(url: "https://example.com/about") {
    status
  }

  # Check URL changed
  aboutURL: url {
    url
  }
}
```

#### URL Tracking During User Interactions

```bql
mutation URLTracking {
  # Initial URL
  initialURL: url {
    url
  }

  # Click navigation link
  click(selector: "a[href='/products']") {
    selector
    time
  }

  # Track URL after click
  afterClickURL: url {
    url
  }

  # Fill form and submit
  type(selector: "input[name='search']", text: "search query") {
    time
  }

  click(selector: "button[type='submit']") {
    selector
    time
  }

  # Track URL after form submission
  afterSubmitURL: url {
    url
  }
}
```

#### Redirect Detection

```bql
mutation RedirectDetection {
  # Navigate to potential redirect URL
  goto(url: "https://short-url.com/redirect") {
    status
    url
  }

  # Get final URL after redirects
  finalURL: url {
    url
  }

  # Check if redirected (compare with original)
  redirectCheck: evaluate(expression: `
    const originalUrl = "https://short-url.com/redirect";
    const currentUrl = window.location.href;
    return {
      wasRedirected: originalUrl !== currentUrl,
      originalUrl: originalUrl,
      finalUrl: currentUrl,
      redirectCount: window.history.length
    };
  `) {
    result
  }
}
```

#### URL Parameter Analysis

```bql
mutation URLParameterAnalysis {
  # Navigate to URL with parameters
  goto(url: "https://example.com/search?q=product&category=electronics&sort=price") {
    status
  }

  # Get current URL
  parametrizedURL: url {
    url
  }

  # Extract and analyze URL parameters
  urlAnalysis: evaluate(expression: `
    const url = new URL(window.location.href);
    const params = Object.fromEntries(url.searchParams);
    return {
      fullUrl: window.location.href,
      pathname: url.pathname,
      searchParams: params,
      paramCount: url.searchParams.size,
      hasQuery: url.search.length > 0,
      protocol: url.protocol,
      hostname: url.hostname
    };
  `) {
    result
  }
}
```

#### History Navigation URL Tracking

```bql
mutation HistoryNavigation {
  # Initial page
  goto(url: "https://example.com") {
    status
  }

  page1URL: url {
    url
  }

  # Navigate to second page
  goto(url: "https://example.com/page2") {
    status
  }

  page2URL: url {
    url
  }

  # Go back and track URL
  back {
    status
  }

  backURL: url {
    url
  }

  # Go forward and track URL
  forward {
    status
  }

  forwardURL: url {
    url
  }
}
```

#### Authentication Flow URL Monitoring

```bql
mutation AuthenticationFlow {
  # Start at login page
  goto(url: "https://app.example.com/login") {
    status
  }

  loginPageURL: url {
    url
  }

  # Fill login form
  type(selector: "input[name='username']", text: "testuser") {
    time
  }

  type(selector: "input[name='password']", text: "password123") {
    time
  }

  # Submit and track redirect
  click(selector: "button[type='submit']") {
    selector
    time
  }

  # Check if redirected to dashboard
  dashboardURL: url {
    url
  }

  # Verify successful authentication by URL
  authVerification: evaluate(expression: `
    const currentUrl = window.location.href;
    return {
      isAuthenticated: currentUrl.includes('/dashboard') || currentUrl.includes('/app'),
      currentPath: window.location.pathname,
      isLoginPage: currentUrl.includes('/login'),
      redirectedSuccessfully: !currentUrl.includes('/login')
    };
  `) {
    result
  }
}
```

#### E-commerce Workflow URL Tracking

```bql
mutation EcommerceURLTracking {
  # Homepage
  goto(url: "https://shop.example.com") {
    status
  }

  homepageURL: url {
    url
  }

  # Navigate to product category
  click(selector: ".category-link[data-category='electronics']") {
    selector
    time
  }

  categoryURL: url {
    url
  }

  # Click on specific product
  click(selector: ".product-card:first-child a") {
    selector
    time
  }

  productURL: url {
    url
  }

  # Add to cart
  click(selector: ".add-to-cart") {
    selector
    time
  }

  cartURL: url {
    url
  }

  # Proceed to checkout
  click(selector: ".checkout-button") {
    selector
    time
  }

  checkoutURL: url {
    url
  }
}
```

#### SPA (Single Page Application) URL Monitoring

```bql
mutation SPAURLMonitoring {
  # Navigate to SPA
  goto(url: "https://spa.example.com") {
    status
  }

  spaHomeURL: url {
    url
  }

  # Click SPA navigation (hash routing)
  click(selector: "[data-route='#/dashboard']") {
    selector
    time
  }

  # Wait for route change
  wait(duration: 1000) {
    duration
  }

  dashboardHashURL: url {
    url
  }

  # Click another SPA route (history API)
  click(selector: "[data-route='/settings']") {
    selector
    time
  }

  wait(duration: 1000) {
    duration
  }

  settingsURL: url {
    url
  }
}
```

#### URL Validation and Security Checks

```bql
mutation URLValidation {
  # Navigate to secure page
  goto(url: "https://secure.example.com") {
    status
  }

  secureURL: url {
    url
  }

  # Validate URL security and structure
  securityValidation: evaluate(expression: `
    const url = new URL(window.location.href);
    return {
      isSecure: url.protocol === 'https:',
      hostname: url.hostname,
      isValidDomain: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.[a-zA-Z]{2,}$/.test(url.hostname),
      hasPort: url.port !== '',
      port: url.port,
      pathname: url.pathname,
      hasSubdomain: url.hostname.split('.').length > 2,
      domainParts: url.hostname.split('.'),
      fullUrl: window.location.href
    };
  `) {
    result
  }
}
```

#### Dynamic Content URL Changes

```bql
mutation DynamicContentURL {
  # Navigate to dynamic page
  goto(url: "https://dynamic.example.com") {
    status
  }

  initialDynamicURL: url {
    url
  }

  # Trigger AJAX content load
  click(selector: ".load-content") {
    selector
    time
  }

  # Wait for content to load
  wait(duration: 2000) {
    duration
  }

  # Check if URL changed
  afterAjaxURL: url {
    url
  }

  # Trigger pushState navigation
  evaluate(content: "history.pushState({}, '', '/new-state')") {
    value
  }

  pushStateURL: url {
    url
  }
}
```

#### Complete URL Workflow

```bql
mutation CompleteURLWorkflow {
  # Initial navigation
  goto(url: "https://example.com") {
    status
  }

  startURL: url {
    url
  }

  # Navigate through site
  click(selector: "nav a[href='/about']") {
    selector
    time
  }

  aboutURL: url {
    url
  }

  # Form interaction
  goto(url: "https://example.com/contact") {
    status
  }

  contactURL: url {
    url
  }

  # Fill and submit form
  type(selector: "input[name='email']", text: "user@example.com") {
    time
  }

  click(selector: "button[type='submit']") {
    selector
    time
  }

  thankYouURL: url {
    url
  }

  # Final URL analysis
  urlAnalysis: evaluate(expression: `
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    return {
      fullUrl: currentUrl,
      protocol: url.protocol,
      hostname: url.hostname,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      origin: url.origin,
      isSecure: url.protocol === 'https:',
      pathDepth: url.pathname.split('/').length - 1,
      hasParams: url.search.length > 0,
      hasHash: url.hash.length > 0
    };
  `) {
    result
  }
}
```

#### url Parameters

- None (this operation takes no arguments)

#### URLResponse Fields

- **url**: String containing the current URL of the page that the browser is viewing

#### url Benefits

- **🔗 Navigation Tracking**: Monitor URL changes during user interactions and workflows
- **✅ Redirect Detection**: Identify and track URL redirects and route changes
- **🎯 Page Verification**: Confirm correct page navigation and routing
- **📊 URL Analysis**: Extract and analyze URL components, parameters, and structure
- **🔍 Security Validation**: Verify secure protocols and domain validation
- **📈 Flow Monitoring**: Track user journey through multi-page workflows
- **🚀 SPA Support**: Monitor URL changes in single-page applications
- **⚡ Real-time Capture**: Get current URL state immediately

#### Common URL Scenarios

| Scenario | Use Case | Implementation |
|----------|----------|----------------|
| **Basic Extraction** | Get current page URL | `url { url }` |
| **Navigation Verification** | Confirm page after navigation | `goto() + url` |
| **Redirect Tracking** | Monitor URL redirects | `url` before/after navigation |
| **Parameter Analysis** | Extract URL parameters | `url + evaluate()` |
| **History Tracking** | Monitor back/forward navigation | Multiple `url` operations |
| **Authentication Flow** | Track login redirects | `url` during auth workflow |
| **E-commerce Journey** | Monitor shopping workflow | `url` at each step |
| **SPA Navigation** | Track single-page app routes | `url` with route changes |

#### URL Component Analysis

Extract and analyze URL components using the url operation combined with JavaScript evaluation:

```bql
# URL component extraction
urlComponents: evaluate(expression: `
  const url = new URL(window.location.href);
  return {
    protocol: url.protocol,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    origin: url.origin
  };
`) { result }
```

#### Security and Validation Patterns

- **HTTPS Verification**: Check for secure protocol usage
- **Domain Validation**: Verify expected domain and subdomain
- **Parameter Sanitization**: Analyze URL parameters for security
- **Redirect Chain Analysis**: Track redirect sequences
- **Origin Verification**: Confirm trusted origins

#### Performance Characteristics

- **Instant Execution**: No network delays or DOM traversal
- **Minimal Overhead**: Lightweight operation with immediate response
- **Real-time State**: Captures current URL state at execution time
- **Memory Efficient**: Returns only the URL string

#### Integration Patterns

- **Navigation Testing**: Verify navigation flows and routing
- **Authentication Workflows**: Track login/logout URL changes
- **E-commerce Journeys**: Monitor shopping and checkout flows
- **Form Submissions**: Track post-submission redirects
- **API Integration**: Monitor URL changes during API interactions
- **SEO Analysis**: Analyze URL structure and parameters

#### Error Handling

- **No Errors**: Operation always succeeds and returns current URL
- **Dynamic URLs**: Captures current state including JavaScript changes
- **Special Characters**: Preserves all URL encoding and special characters
- **Real-time Accuracy**: Always reflects current browser location

The url operation provides essential navigation tracking capabilities for workflow verification, redirect analysis, authentication monitoring, and comprehensive web automation testing with immediate, accurate URL state capture.

### userAgent Operation (userAgent)

Sets the User-Agent string for the browser session, enabling device simulation, browser identification customization, and responsive design testing. The userAgent operation provides comprehensive browser simulation capabilities for testing across different devices, browsers, and platforms.

#### Basic userAgent Usage

```bql
mutation BasicUserAgent {
  # Set mobile iPhone User-Agent
  userAgent(userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15") {
    userAgent
    time
  }
  
  # Navigate with mobile User-Agent
  goto(url: "https://example.com") {
    status
  }
}
```

#### Mobile Device Simulation

```bql
mutation MobileSimulation {
  # iPhone User-Agent
  iPhoneAgent: userAgent(userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1") {
    userAgent
    time
  }
  
  # Test mobile layout
  goto(url: "https://example.com") {
    status
  }
  
  mobileContent: text(selector: ".mobile-content") {
    text
  }
  
  # Android User-Agent
  androidAgent: userAgent(userAgent: "Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36") {
    userAgent
    time
  }
  
  # iPad User-Agent
  iPadAgent: userAgent(userAgent: "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1") {
    userAgent
    time
  }
}
```

#### Desktop Browser Simulation

```bql
mutation DesktopSimulation {
  # Chrome Windows User-Agent
  chromeWindows: userAgent(userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36") {
    userAgent
    time
  }
  
  # Firefox User-Agent
  firefoxAgent: userAgent(userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0") {
    userAgent
    time
  }
  
  # Safari macOS User-Agent
  safariMac: userAgent(userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15") {
    userAgent
    time
  }
  
  # Edge User-Agent
  edgeAgent: userAgent(userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0") {
    userAgent
    time
  }
}
```

#### Bot and Crawler Simulation

```bql
mutation BotSimulation {
  # Custom web crawler
  customBot: userAgent(userAgent: "CustomBot/1.0 (+https://example.com/bot)") {
    userAgent
    time
  }
  
  # SEO analysis bot
  seoBot: userAgent(userAgent: "SEOBot/1.0 (SEO Analysis; +https://example.com/seo-bot)") {
    userAgent
    time
  }
  
  # Social media bot simulation
  facebookBot: userAgent(userAgent: "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)") {
    userAgent
    time
  }
  
  twitterBot: userAgent(userAgent: "Twitterbot/1.0") {
    userAgent
    time
  }
  
  # Google bot simulation
  googleBot: userAgent(userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)") {
    userAgent
    time
  }
}
```

#### Responsive Design Testing

```bql
mutation ResponsiveDesignTesting {
  # Test mobile layout
  mobileAgent: userAgent(userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15") {
    userAgent
    time
  }
  
  goto(url: "https://responsive.example.com") {
    status
  }
  
  # Check mobile viewport
  mobileViewport: evaluate(expression: "window.innerWidth") {
    value
  }
  
  mobileLayout: text(selector: ".mobile-nav") {
    text
  }
  
  # Switch to desktop
  desktopAgent: userAgent(userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36") {
    userAgent
    time
  }
  
  reload {
    status
  }
  
  # Check desktop viewport
  desktopViewport: evaluate(expression: "window.innerWidth") {
    value
  }
  
  desktopLayout: text(selector: ".desktop-nav") {
    text
  }
}
```

#### A/B Testing with User-Agents

```bql
mutation ABTestingUserAgent {
  # Test variant A
  variantA: userAgent(userAgent: "TestVariant-A/1.0 (A/B Testing)") {
    userAgent
    time
  }
  
  goto(url: "https://abtest.example.com") {
    status
  }
  
  contentA: text(selector: ".test-content") {
    text
  }
  
  # Test variant B
  variantB: userAgent(userAgent: "TestVariant-B/1.0 (A/B Testing)") {
    userAgent
    time
  }
  
  goto(url: "https://abtest.example.com") {
    status
  }
  
  contentB: text(selector: ".test-content") {
    text
  }
  
  # Compare results
  comparison: evaluate(expression: `
    return {
      variantA: "${contentA.text}",
      variantB: "${contentB.text}",
      different: "${contentA.text}" !== "${contentB.text}"
    };
  `) {
    value
  }
}
```

#### Legacy Browser Testing

```bql
mutation LegacyBrowserTesting {
  # Internet Explorer simulation
  ieAgent: userAgent(userAgent: "Mozilla/5.0 (compatible; MSIE 11.0; Windows NT 6.1; WOW64; Trident/7.0)") {
    userAgent
    time
  }
  
  goto(url: "https://legacy.example.com") {
    status
  }
  
  # Test legacy compatibility
  legacySupport: evaluate(expression: `
    return {
      supportsES6: typeof Set !== 'undefined',
      supportsFetch: typeof fetch !== 'undefined',
      supportsLocalStorage: typeof localStorage !== 'undefined',
      userAgent: navigator.userAgent
    };
  `) {
    value
  }
  
  # Feature phone simulation
  featurePhone: userAgent(userAgent: "Nokia6230i/1.0 (2.22) Profile/MIDP-2.0 Configuration/CLDC-1.1") {
    userAgent
    time
  }
}
```

#### Device-Specific Testing

```bql
mutation DeviceSpecificTesting {
  # Smart TV simulation
  smartTV: userAgent(userAgent: "Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/76.0.3809.146 TV Safari/537.36") {
    userAgent
    time
  }
  
  # Gaming console simulation
  playstation: userAgent(userAgent: "Mozilla/5.0 (PlayStation 5; compatible) AppleWebKit/537.73 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36") {
    userAgent
    time
  }
  
  # E-reader simulation
  kindle: userAgent(userAgent: "Mozilla/5.0 (X11; U; Linux armv6l; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Silk/120.0.0.0 like Chrome/120.0.0.0 Safari/537.36 Kindle/3.0") {
    userAgent
    time
  }
  
  # Mobile app webview
  webView: userAgent(userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MyApp/1.0") {
    userAgent
    time
  }
}
```

#### Performance Testing with User-Agents

```bql
mutation PerformanceTestingUserAgent {
  # Load testing bot
  loadTestBot: userAgent(userAgent: "LoadTest/1.0 (Performance Testing; +https://example.com/load-test)") {
    userAgent
    time
  }
  
  # Performance monitoring bot
  perfMonitor: userAgent(userAgent: "PerfTest/1.0 (Performance Monitoring; +https://example.com/perf)") {
    userAgent
    time
  }
  
  # Security scanner
  securityBot: userAgent(userAgent: "SecurityScanner/1.0 (Vulnerability Assessment; +https://example.com/security)") {
    userAgent
    time
  }
}
```

#### Complete Device Simulation Workflow

```bql
mutation CompleteDeviceSimulation {
  # Mobile simulation workflow
  mobileSimulation: userAgent(userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15") {
    userAgent
    time
  }
  
  goto(url: "https://example.com") {
    status
  }
  
  # Test mobile features
  mobileFeatures: evaluate(expression: `
    return {
      isMobile: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent),
      touchSupport: 'ontouchstart' in window,
      screenWidth: screen.width,
      screenHeight: screen.height,
      devicePixelRatio: window.devicePixelRatio
    };
  `) {
    value
  }
  
  # Desktop simulation
  desktopSimulation: userAgent(userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36") {
    userAgent
    time
  }
  
  goto(url: "https://example.com") {
    status
  }
  
  # Test desktop features
  desktopFeatures: evaluate(expression: `
    return {
      isMobile: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent),
      hasKeyboard: navigator.keyboard !== undefined,
      screenWidth: screen.width,
      screenHeight: screen.height,
      availableWidth: screen.availWidth
    };
  `) {
    value
  }
  
  # User-Agent verification
  finalCheck: evaluate(expression: "navigator.userAgent") {
    value
  }
}
```

#### userAgent Parameters

- **userAgent** (String!, required): The User-Agent string to set for the browser session

#### UserAgentResponse Fields

- **userAgent**: String containing the User-Agent string that was set for the browser session
- **time**: Float containing the time taken to set the User-Agent in milliseconds

#### userAgent Benefits

- **🕶️ Device Simulation**: Simulate mobile, tablet, desktop, and specialty devices
- **🔍 Browser Testing**: Test across different browser engines and versions
- **🤖 Bot Simulation**: Simulate search engine crawlers, social media bots, and custom crawlers
- **📱 Responsive Design**: Test responsive layouts and mobile-first designs
- **🧪 A/B Testing**: Create different user experiences based on User-Agent detection
- **⚡ Performance Testing**: Use specialized User-Agents for load and performance testing
- **🔒 Security Testing**: Test bot detection and User-Agent-based security measures
- **📊 Analytics Testing**: Verify tracking and analytics across different platforms

#### Common userAgent Scenarios

| Scenario | User-Agent Example | Use Case |
|----------|-------------------|----------|
| **iPhone Mobile** | `Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)` | Mobile layout testing |
| **Android Mobile** | `Mozilla/5.0 (Linux; Android 12; SM-G991B)` | Android-specific features |
| **iPad Tablet** | `Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)` | Tablet layout testing |
| **Chrome Desktop** | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0` | Desktop browser testing |
| **Custom Bot** | `CustomBot/1.0 (+https://example.com/bot)` | Web scraping and automation |
| **SEO Bot** | `SEOBot/1.0 (SEO Analysis)` | Search engine optimization |
| **Social Bot** | `facebookexternalhit/1.1` | Social media sharing testing |
| **Legacy Browser** | `Mozilla/5.0 (compatible; MSIE 11.0)` | Legacy compatibility testing |

#### Popular User-Agent Strings

**Mobile Devices:**
```javascript
// iPhone Safari
"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"

// Android Chrome
"Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"

// iPad Safari
"Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
```

**Desktop Browsers:**
```javascript
// Chrome Windows
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

// Firefox Windows
"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0"

// Safari macOS
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
```

**Bot User-Agents:**
```javascript
// Google Bot
"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

// Facebook Bot
"facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"

// Custom Bot
"CustomBot/1.0 (+https://example.com/bot)"
```

#### Device Detection Patterns

Use userAgent combined with JavaScript evaluation to detect device capabilities:

```bql
# Device detection workflow
deviceDetection: evaluate(expression: `
  const ua = navigator.userAgent;
  return {
    isMobile: /Mobile|Android|iPhone/.test(ua),
    isTablet: /iPad/.test(ua),
    isDesktop: !/Mobile|Android|iPhone|iPad/.test(ua),
    browser: ua.includes('Chrome') ? 'Chrome' : 
             ua.includes('Firefox') ? 'Firefox' : 
             ua.includes('Safari') ? 'Safari' : 'Other',
    platform: navigator.platform,
    touchSupport: 'ontouchstart' in window
  };
`) { value }
```

#### User-Agent Best Practices

- **🎯 Accurate Simulation**: Use realistic, current User-Agent strings from actual devices
- **🔄 Regular Updates**: Update User-Agent strings as browsers and devices evolve
- **📊 Analytics Aware**: Consider how User-Agents affect analytics and tracking
- **🔍 Bot Identification**: Include contact information in custom bot User-Agents
- **⚡ Performance Impact**: User-Agent changes have minimal performance overhead
- **🔒 Security Considerations**: Some sites may block or limit certain User-Agents

#### Integration Patterns

- **Responsive Testing**: Test mobile and desktop layouts with appropriate User-Agents
- **Cross-Browser Testing**: Verify functionality across different browser engines
- **Bot Development**: Create appropriate User-Agents for web scraping and automation
- **A/B Testing**: Use User-Agent detection for feature flags and experiments
- **Performance Testing**: Simulate various devices for load and performance testing
- **SEO Testing**: Test search engine bot behavior and content accessibility

#### Error Handling

- **Invalid User-Agents**: Operation succeeds but may trigger different server responses
- **Empty Strings**: Setting empty User-Agent may revert to browser default
- **Special Characters**: User-Agent strings support all standard characters
- **Length Limits**: Extremely long User-Agents may be truncated by servers

#### Performance Characteristics

- **Instant Application**: User-Agent changes apply immediately to subsequent requests
- **Session Persistence**: User-Agent remains set for the duration of the browser session
- **Minimal Overhead**: Operation completes in under 10ms typically
- **No Page Reload**: User-Agent changes don't require page reloading

The userAgent operation provides essential device simulation capabilities for responsive design testing, cross-browser compatibility, bot development, and comprehensive web automation testing with realistic device and browser identification.

### verify Operation (verify) 🚨 EXPERIMENTAL

Detects and solves verification challenges and CAPTCHA systems for automated testing workflows. The verify operation provides experimental capabilities for handling bot protection systems and human verification challenges during web automation.

> **⚠️ EXPERIMENTAL FEATURE**: This operation is currently experimental and subject to change. Use with caution in production environments and always ensure compliance with target site terms of service.

#### Basic verify Usage

```bql
mutation BasicVerify {
  # Navigate to protected page
  goto(url: "https://protected.domain") {
    status
  }
  
  # Solve Cloudflare verification challenge
  verify(type: cloudflare) {
    found
    solved
    time
  }
}
```

#### Authentication Verification Workflow

```bql
mutation AuthenticationVerification {
  # Navigate to login page
  goto(url: "https://auth.example.com/login") {
    status
  }
  
  # Fill credentials
  type(selector: "input[name='username']", text: "testuser") {
    time
  }
  
  type(selector: "input[name='password']", text: "password123") {
    time
  }
  
  # Solve verification before login
  authVerify: verify(
    type: cloudflare
    timeout: 30000
  ) {
    found
    solved
    time
  }
  
  # Submit login form after verification
  click(selector: "button[type='submit']") {
    selector
    time
  }
  
  # Verify successful login
  loginSuccess: text(selector: ".welcome-message") {
    text
  }
}
```

#### Advanced Verification Patterns

```bql
mutation AdvancedVerification {
  # Navigate to protected resource
  goto(url: "https://protected.example.com") {
    status
    url
  }

  # Quick verification check without waiting
  quickCheck: verify(
    type: cloudflare
    wait: false
    timeout: 5000
  ) {
    found
    solved
    time
  }

  # Full verification with extended timeout
  fullVerification: verify(
    type: cloudflare
    timeout: 45000
    wait: true
  ) {
    found
    solved
    time
  }

  # Conditional retry based on results
  retryIfNeeded: verify(
    type: cloudflare
    timeout: 60000
  ) {
    found
    solved
    time
  }

  # Access protected content after verification
  protectedContent: html(selector: ".protected-content") {
    html
    time
  }
}
```

#### Form Submission with Verification

```bql
mutation FormVerification {
  # Navigate to contact form
  goto(url: "https://contact.example.com") {
    status
  }
  
  # Fill form fields
  type(selector: "input[name='email']", text: "user@example.com") {
    time
  }
  
  type(selector: "textarea[name='message']", text: "Contact inquiry message") {
    time
  }
  
  # Solve verification before submission
  formVerify: verify(type: cloudflare) {
    found
    solved
    time
  }
  
  # Submit form after verification
  click(selector: "button[type='submit']") {
    selector
    time
  }
  
  # Verify successful submission
  submitSuccess: text(selector: ".success-message") {
    text
  }
}
```

#### E-commerce Verification Workflow

```bql
mutation EcommerceVerification {
  # Navigate to checkout page
  goto(url: "https://shop.example.com/checkout") {
    status
  }
  
  # Fill payment information
  type(selector: "input[name='card_number']", text: "4111111111111111") {
    time
  }
  
  type(selector: "input[name='expiry']", text: "12/25") {
    time
  }
  
  # Solve checkout verification
  checkoutVerify: verify(
    type: cloudflare
    timeout: 30000
  ) {
    found
    solved
    time
  }
  
  # Complete purchase after verification
  click(selector: "button.complete-order") {
    selector
    time
  }
  
  # Verify order completion
  orderSuccess: text(selector: ".order-confirmation") {
    text
  }
}
```

#### API Endpoint Verification

```bql
mutation APIVerification {
  # Navigate to protected API endpoint
  goto(url: "https://api.example.com/protected") {
    status
  }
  
  # Solve API access verification
  apiVerify: verify(
    type: cloudflare
    timeout: 30000
  ) {
    found
    solved
    time
  }
  
  # Make API request after verification
  apiRequest: evaluate(expression: `
    return fetch('/api/data', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(r => r.json());
  `) {
    value
  }
}
```

#### Multiple Verification Attempts

```bql
mutation MultipleVerificationAttempts {
  # First attempt with short timeout
  firstAttempt: verify(
    type: cloudflare
    timeout: 15000
  ) {
    found
    solved
    time
  }
  
  # Retry with longer timeout if needed
  retryAttempt: verify(
    type: cloudflare
    timeout: 45000
    wait: true
  ) {
    found
    solved
    time
  }
  
  # Final attempt with maximum patience
  finalAttempt: verify(
    type: cloudflare
    timeout: 60000
    wait: true
  ) {
    found
    solved
    time
  }
  
  # Verification status summary
  verificationSummary: evaluate(expression: `
    return {
      attempts: 3,
      firstSuccess: ${firstAttempt.solved},
      retrySuccess: ${retryAttempt.solved},
      finalSuccess: ${finalAttempt.solved},
      totalTime: ${firstAttempt.time} + ${retryAttempt.time} + ${finalAttempt.time}
    };
  `) {
    value
  }
}
```

#### Bot Protection Testing

```bql
mutation BotProtectionTesting {
  # Test various protected endpoints
  goto(url: "https://admin.example.com") {
    status
  }
  
  # Admin area verification
  adminVerify: verify(
    type: cloudflare
    timeout: 60000
  ) {
    found
    solved
    time
  }
  
  # Navigate to API documentation
  goto(url: "https://docs.example.com/api") {
    status
  }
  
  # Documentation access verification
  docsVerify: verify(
    type: cloudflare
    timeout: 30000
  ) {
    found
    solved
    time
  }
  
  # Test webhook endpoint protection
  goto(url: "https://webhook.example.com/endpoint") {
    status
  }
  
  # Webhook verification (quick check)
  webhookVerify: verify(
    type: cloudflare
    wait: false
  ) {
    found
    solved
    time
  }
}
```

#### Verification Performance Analysis

```bql
mutation VerificationPerformanceAnalysis {
  # Baseline verification
  baselineVerify: verify(
    type: cloudflare
    timeout: 30000
  ) {
    found
    solved
    time
  }
  
  # Performance metrics
  performanceMetrics: evaluate(expression: `
    return {
      verificationTime: ${baselineVerify.time},
      verificationFound: ${baselineVerify.found},
      verificationSolved: ${baselineVerify.solved},
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      pageLocation: window.location.href,
      pageTitle: document.title
    };
  `) {
    value
  }
  
  # Test verification under different conditions
  stressVerify: verify(
    type: cloudflare
    timeout: 10000
  ) {
    found
    solved
    time
  }
  
  # Extended verification
  extendedVerify: verify(
    type: cloudflare
    timeout: 90000
  ) {
    found
    solved
    time
  }
}
```

#### verify Parameters

- **type** (VerifyTypes!, required): The type of verification challenge to detect and solve
  - `cloudflare`: Cloudflare verification challenges and bot protection
- **timeout** (Float, optional): Maximum time in milliseconds to wait for verification (default: 30000ms)
- **wait** (Boolean, optional): Whether to wait for verification to appear on the page (default: true)

#### CaptchaResponse Fields

- **found**: Boolean indicating whether a verification challenge was detected on the page
- **solved**: Boolean indicating whether the verification challenge was successfully solved
- **time**: Float containing the time taken to solve the verification challenge in milliseconds

#### verify Benefits

- **🚨 Experimental Automation**: Advanced verification challenge solving (experimental feature)
- **⚡ Timeout Control**: Configurable wait times for different verification scenarios
- **🔍 Detection Logic**: Smart detection of verification challenges on pages
- **📊 Status Reporting**: Detailed feedback on verification detection and solving
- **🔄 Retry Support**: Multiple attempt strategies for reliable verification solving
- **🛡️ Bot Protection**: Handle modern bot protection and verification systems
- **⚙️ Workflow Integration**: Seamless integration with other BQL operations
- **📈 Performance Monitoring**: Time tracking for verification solving performance

#### Common verify Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **Authentication** | `verify(type: cloudflare)` | Login form protection |
| **Form Submission** | `verify(type: cloudflare, timeout: 30000)` | Contact form verification |
| **API Access** | `verify(type: cloudflare, timeout: 45000)` | Protected API endpoints |
| **E-commerce** | `verify(type: cloudflare, wait: true)` | Checkout process verification |
| **Quick Check** | `verify(type: cloudflare, wait: false)` | Fast verification detection |
| **Extended Wait** | `verify(type: cloudflare, timeout: 60000)` | Complex verification challenges |
| **Admin Access** | `verify(type: cloudflare, timeout: 90000)` | High-security areas |
| **Content Gating** | `verify(type: cloudflare, timeout: 20000)` | Premium content access |

#### Verification Types

**Cloudflare Protection:**
- Bot challenge pages
- JavaScript challenges
- Interactive verification
- Rate limiting protection
- DDoS protection pages

#### Verification Workflow Patterns

**Authentication Flow:**
```bql
# 1. Navigate to login page
# 2. Fill credentials  
# 3. Solve verification challenge
# 4. Submit login form
# 5. Verify successful authentication
```

**Form Submission Flow:**
```bql
# 1. Navigate to form page
# 2. Fill form fields
# 3. Solve verification challenge
# 4. Submit form
# 5. Verify successful submission
```

**API Access Flow:**
```bql
# 1. Navigate to protected API
# 2. Solve access verification
# 3. Make API requests
# 4. Process API responses
```

#### Best Practices

- **🚨 Experimental Usage**: Remember this is an experimental feature subject to change
- **⏱️ Appropriate Timeouts**: Set realistic timeouts based on verification complexity
- **🔄 Retry Logic**: Implement multiple attempts for reliability
- **📊 Status Checking**: Always check `found` and `solved` status in responses
- **⚡ Performance Monitoring**: Track verification times for optimization
- **🔒 Compliance**: Ensure usage complies with target site terms of service
- **🛡️ Rate Limiting**: Be mindful of verification service rate limits
- **📋 Error Handling**: Handle cases where verification cannot be solved

#### Integration Patterns

- **Authentication Testing**: Integrate with login workflows and user management
- **Form Testing**: Use with contact forms, surveys, and data submission
- **API Testing**: Handle verification in API access and endpoint testing
- **E-commerce Testing**: Integrate with shopping carts and checkout processes
- **Content Testing**: Access premium or protected content areas
- **Security Testing**: Test bot protection and verification system effectiveness

#### Error Handling

- **Challenge Not Found**: `found: false` indicates no verification challenge detected
- **Solution Failed**: `solved: false` indicates verification could not be completed
- **Timeout Exceeded**: Operation may timeout if verification takes too long
- **Invalid Type**: Only supported verification types are accepted
- **Network Issues**: Verification may fail due to connectivity problems

#### Performance Characteristics

- **Variable Duration**: Verification time depends on challenge complexity (5-60+ seconds)
- **Detection Speed**: Challenge detection is typically fast (under 1 second)
- **Success Rates**: Success rates vary by verification type and site configuration
- **Timeout Management**: Configure timeouts based on expected verification complexity
- **Resource Usage**: Verification solving may consume additional CPU and memory

#### Security Considerations

- **Terms of Service**: Always comply with target website terms of service
- **Rate Limiting**: Respect verification service rate limits and throttling
- **Legitimate Use**: Use verification solving for legitimate testing purposes only
- **Data Privacy**: Handle any personal data in compliance with privacy regulations
- **Access Control**: Limit verification capabilities to authorized testing scenarios

#### Troubleshooting

**Common Issues:**
- Verification not found: Check if protection is actually present
- Solution timeout: Increase timeout value for complex challenges
- Repeated failures: Verify site compatibility and current protection methods
- Performance issues: Monitor verification times and optimize timeouts

**Debugging Tips:**
- Use `wait: false` for quick verification detection tests
- Check browser console for verification-related errors
- Monitor network requests during verification attempts
- Test with different timeout values to find optimal settings

The verify operation provides experimental capabilities for handling modern web verification challenges, enabling automated testing workflows that can navigate bot protection systems while maintaining compliance with ethical testing practices.

### waitForNavigation Operation (waitForNavigation)

Waits for a navigation event to fire, essential for handling page loads after user interactions like clicks, form submissions, and programmatic navigation. The waitForNavigation operation provides comprehensive navigation timing control for reliable automated testing workflows.

#### Basic waitForNavigation Usage

```bql
mutation BasicWaitForNavigation {
  # Navigate to initial page
  goto(url: "https://example.com") {
    status
  }

  # Wait for navigation to complete
  waitForNavigation {
    status
    url
    time
  }
}
```

#### Form Submission Navigation

```bql
mutation FormSubmissionNavigation {
  # Fill and submit form
  type(selector: "input[name='search']", text: "search query") {
    time
  }

  click(selector: "button[type='submit']") {
    selector
  }

  # Wait for form submission navigation
  formNavigation: waitForNavigation(
    timeout: 30000
    waitUntil: load
  ) {
    status
    url
    time
  }
}
```

#### Link Navigation Workflow

```bql
mutation LinkNavigationWorkflow {
  # Click navigation link
  click(selector: "a[href='/products']") {
    selector
  }

  # Wait for link navigation to complete
  linkNavigation: waitForNavigation {
    status
    url
    time
  }

  # Verify new page loaded
  pageTitle: text(selector: "h1") {
    text
  }
}
```

#### Authentication Navigation

```bql
mutation AuthenticationNavigation {
  # Navigate to login page
  goto(url: "https://auth.example.com/login") {
    status
  }

  # Fill credentials
  type(selector: "input[name='username']", text: "testuser") {
    time
  }

  type(selector: "input[name='password']", text: "password123") {
    time
  }

  # Submit login form
  click(selector: "button[type='submit']") {
    selector
  }

  # Wait for authentication redirect
  authNavigation: waitForNavigation(
    timeout: 30000
    waitUntil: load
  ) {
    status
    url
    headers
    time
  }

  # Verify successful login
  welcomeMessage: text(selector: ".welcome") {
    text
  }
}
```

#### Single Page Application Navigation

```bql
mutation SPANavigation {
  # Click SPA navigation link
  click(selector: ".nav-link[data-route='/dashboard']") {
    selector
  }

  # Wait for SPA route change
  spaNavigation: waitForNavigation(
    timeout: 15000
    waitUntil: domcontentloaded
  ) {
    status
    url
    time
  }

  # Verify route changed
  dashboardContent: text(selector: ".dashboard-title") {
    text
  }
}
```

#### Redirect Navigation Handling

```bql
mutation RedirectNavigation {
  # Navigate to redirecting URL
  goto(url: "https://redirect.example.com") {
    status
  }

  # Wait for redirect completion
  redirectNavigation: waitForNavigation(
    timeout: 45000
    waitUntil: networkidle
  ) {
    status
    url
    headers
    time
  }

  # Verify final destination
  finalPageContent: html(selector: "body") {
    html
  }
}
```

#### E-commerce Navigation Workflow

```bql
mutation EcommerceNavigation {
  # Add item to cart
  click(selector: "button.add-to-cart") {
    selector
  }

  # Wait for cart page navigation
  cartNavigation: waitForNavigation(
    timeout: 25000
    waitUntil: load
  ) {
    status
    url
    time
  }

  # Verify cart page loaded
  cartItems: text(selector: ".cart-items") {
    text
  }

  # Proceed to checkout
  click(selector: "button.proceed-checkout") {
    selector
  }

  # Wait for checkout navigation
  checkoutNavigation: waitForNavigation(
    timeout: 35000
    waitUntil: load
  ) {
    status
    url
    time
  }
}
```

#### Advanced Navigation Patterns

```bql
mutation AdvancedNavigationPatterns {
  # Programmatic navigation
  evaluate(expression: "window.location.href = '/api/endpoint'") {
    value
  }

  # Wait for programmatic navigation
  programmaticNavigation: waitForNavigation(
    timeout: 20000
    waitUntil: domcontentloaded
  ) {
    status
    url
    time
  }

  # AJAX navigation
  click(selector: ".ajax-link") {
    selector
  }

  # Wait for AJAX navigation
  ajaxNavigation: waitForNavigation(
    timeout: 15000
    waitUntil: networkidle
  ) {
    status
    url
    time
  }

  # History navigation
  evaluate(expression: "history.back()") {
    value
  }

  # Wait for back navigation
  backNavigation: waitForNavigation(
    timeout: 10000
    waitUntil: domcontentloaded
  ) {
    status
    url
    time
  }
}
```

#### Navigation Performance Analysis

```bql
mutation NavigationPerformanceAnalysis {
  # Baseline navigation
  baselineNavigation: waitForNavigation(
    timeout: 30000
    waitUntil: load
  ) {
    status
    url
    time
  }

  # Performance metrics
  performanceMetrics: evaluate(expression: `
    return {
      navigationTime: ${baselineNavigation.time},
      currentUrl: window.location.href,
      readyState: document.readyState,
      loadEventEnd: performance.timing.loadEventEnd,
      navigationStart: performance.timing.navigationStart,
      totalLoadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
    };
  `) {
    value
  }

  # Test different wait conditions
  fastNavigation: waitForNavigation(
    timeout: 10000
    waitUntil: domcontentloaded
  ) {
    status
    url
    time
  }

  # Network idle navigation
  networkIdleNavigation: waitForNavigation(
    timeout: 45000
    waitUntil: networkidle
  ) {
    status
    url
    time
  }
}
```

#### waitForNavigation Parameters

- **timeout** (Float, optional): The maximum amount of time, in milliseconds, to wait for the page to load, overriding any defaults. Default timeout is 30 seconds, or 30000
- **waitUntil** (WaitUntilGoto, optional): When to consider the page fully-loaded and proceed with further execution. Default is `load`

#### WaitUntilGoto Options

- **`load`**: Wait for the load event to fire (default behavior)
- **`domcontentloaded`**: Wait for DOMContentLoaded event (faster, suitable for SPAs)
- **`networkidle`**: Wait for network to be idle (no requests for 500ms)

#### HTTPResponse Fields

- **status**: String containing the HTTP status code of the navigation response
- **url**: String containing the final URL after navigation and any redirects
- **headers**: String containing HTTP response headers from the navigation
- **time**: Float containing the time taken to complete the navigation in milliseconds

#### waitForNavigation Benefits

- **⏱️ Navigation Timing**: Precise control over when to consider navigation complete
- **🔄 Redirect Handling**: Automatically handles redirects and provides final URL
- **📊 Performance Monitoring**: Track navigation timing for performance analysis
- **🎯 Flexible Wait Conditions**: Multiple wait conditions for different scenarios
- **🛡️ Reliable Testing**: Ensures page loads complete before proceeding
- **📱 SPA Support**: Optimized wait conditions for single-page applications
- **⚡ Timeout Control**: Configurable timeouts for different navigation scenarios
- **🔍 Status Reporting**: Detailed navigation status and response information

#### Common waitForNavigation Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **Form Submission** | `waitForNavigation(waitUntil: load)` | Wait for form POST navigation |
| **Link Navigation** | `waitForNavigation()` | Basic link click navigation |
| **SPA Navigation** | `waitForNavigation(waitUntil: domcontentloaded)` | Single-page app route changes |
| **AJAX Navigation** | `waitForNavigation(waitUntil: networkidle)` | Dynamic content loading |
| **Authentication** | `waitForNavigation(timeout: 30000)` | Login redirect handling |
| **Redirect Chains** | `waitForNavigation(timeout: 45000, waitUntil: networkidle)` | Multiple redirects |
| **Fast Navigation** | `waitForNavigation(timeout: 10000, waitUntil: domcontentloaded)` | Quick page changes |
| **Slow Loading** | `waitForNavigation(timeout: 60000, waitUntil: load)` | Heavy pages with resources |

#### Navigation Event Types

**Page Load Events:**
- Initial page navigation
- Form submission redirects
- Link click navigation
- Programmatic navigation
- History navigation (back/forward)

**SPA Navigation:**
- Route changes in React/Vue/Angular apps
- Hash-based navigation
- History API navigation
- Dynamic content updates

**E-commerce Flows:**
- Add to cart navigation
- Checkout process steps
- Payment processing redirects
- Order confirmation pages

#### Navigation Workflow Patterns

**Form Submission Pattern:**
```bql
# 1. Fill form fields
# 2. Click submit button
# 3. Wait for navigation
# 4. Verify new page content
```

**Authentication Pattern:**
```bql
# 1. Navigate to login page
# 2. Fill credentials
# 3. Submit login form
# 4. Wait for redirect
# 5. Verify authentication success
```

**E-commerce Pattern:**
```bql
# 1. Browse products
# 2. Add items to cart
# 3. Wait for cart navigation
# 4. Proceed to checkout
# 5. Wait for checkout navigation
```

#### Best Practices

- **⏱️ Appropriate Timeouts**: Set realistic timeouts based on expected page load times
- **🎯 Choose Right Wait Condition**: Use `domcontentloaded` for SPAs, `load` for full pages
- **🔄 Handle Redirects**: Allow sufficient timeout for redirect chains
- **📊 Monitor Performance**: Track navigation times for performance optimization
- **🛡️ Error Handling**: Handle navigation timeouts gracefully
- **📱 SPA Considerations**: Use appropriate wait conditions for single-page applications
- **⚡ Network Conditions**: Adjust timeouts based on expected network performance

#### Integration Patterns

- **Form Testing**: Integrate with form filling and submission workflows
- **Authentication Testing**: Handle login redirects and session management
- **E-commerce Testing**: Navigate through shopping and checkout processes
- **SPA Testing**: Handle route changes and dynamic content loading
- **Performance Testing**: Monitor navigation timing and optimize user experience
- **Cross-browser Testing**: Ensure consistent navigation behavior across browsers

#### Error Handling

- **Navigation Timeout**: Occurs when navigation takes longer than specified timeout
- **Navigation Failure**: Network errors or server issues during navigation
- **Invalid Wait Condition**: Using unsupported wait conditions
- **Multiple Navigations**: Handling rapid successive navigation events
- **Redirect Loops**: Detecting and handling infinite redirect scenarios

#### Performance Characteristics

- **Fast Detection**: Navigation event detection is typically under 100ms
- **Variable Duration**: Navigation time depends on page complexity and network conditions
- **Memory Efficient**: Minimal memory overhead while waiting for navigation
- **Resource Monitoring**: Tracks network requests and resource loading
- **Timing Accuracy**: Precise timing measurements for performance analysis

#### Troubleshooting

**Common Issues:**
- Navigation timeout: Increase timeout value or check network conditions
- Wrong wait condition: Choose appropriate wait condition for page type
- Multiple navigations: Handle rapid navigation changes properly
- SPA navigation: Use `domcontentloaded` instead of `load` for SPAs

**Debugging Tips:**
- Monitor browser network tab for navigation requests
- Check console for JavaScript errors during navigation
- Verify page load events are firing correctly
- Test with different wait conditions to find optimal settings

The waitForNavigation operation provides essential navigation timing control for reliable automated testing, ensuring page loads complete before proceeding with subsequent operations in web automation workflows.

### waitForRequest Operation (waitForRequest)

Waits for the browser to make a particular network request, essential for monitoring API calls, resource loading, and network communication patterns. The waitForRequest operation provides comprehensive network monitoring capabilities for debugging, testing, and performance analysis.

#### Basic waitForRequest Usage

```bql
mutation BasicWaitForRequest {
  # Navigate to page that makes API calls
  goto(url: "https://browserless.io") {
    status
  }

  # Wait for any GET request
  waitForRequest(method: GET) {
    method
    url
    time
  }
}
```

#### API Monitoring Workflow

```bql
mutation APIMonitoring {
  # Navigate to application
  goto(url: "https://app.example.com") {
    status
  }

  # Wait for specific API endpoint
  apiRequest: waitForRequest(
    method: POST
    url: "**/api/users**"
  ) {
    method
    url
    headers
    postData
    time
  }

  # Verify API call was made
  content: text(selector: ".user-data") {
    text
  }
}
```

#### Form Submission Monitoring

```bql
mutation FormSubmissionMonitoring {
  # Navigate to login form
  goto(url: "https://login.example.com") {
    status
  }

  # Fill form fields
  type(selector: "input[name='username']", text: "testuser") {
    time
  }

  type(selector: "input[name='password']", text: "password123") {
    time
  }

  # Submit form
  click(selector: "button[type='submit']") {
    selector
  }

  # Monitor login request
  loginRequest: waitForRequest(
    method: POST
    url: "**/login**"
  ) {
    method
    url
    headers
    postData
    time
  }
}
```

#### AJAX Request Monitoring

```bql
mutation AJAXMonitoring {
  # Navigate to SPA
  goto(url: "https://spa-app.example.com") {
    status
  }

  # Trigger AJAX request
  click(selector: "button.load-data") {
    selector
  }

  # Wait for AJAX call
  ajaxRequest: waitForRequest(
    method: GET
    url: "**/api/data**"
  ) {
    method
    url
    headers
    time
  }

  # Verify data loaded
  dataContent: text(selector: ".data-container") {
    text
  }
}
```

#### Resource Loading Monitoring

```bql
mutation ResourceMonitoring {
  # Navigate to media-rich page
  goto(url: "https://media.example.com") {
    status
  }

  # Monitor image loading
  imageRequest: waitForRequest(url: "**/*.{jpg,png,gif,webp}") {
    method
    url
    time
  }

  # Monitor JavaScript loading
  scriptRequest: waitForRequest(url: "**/*.js") {
    method
    url
    headers
    time
  }

  # Monitor CSS loading
  cssRequest: waitForRequest(url: "**/*.css") {
    method
    url
    time
  }
}
```

#### Third-Party Integration Monitoring

```bql
mutation ThirdPartyMonitoring {
  # Navigate to page with integrations
  goto(url: "https://integrated.example.com") {
    status
  }

  # Monitor CDN requests
  cdnRequest: waitForRequest(url: "https://cdn.example.com/**") {
    method
    url
    headers
    time
  }

  # Monitor analytics requests
  analyticsRequest: waitForRequest(url: "**/analytics/**") {
    method
    url
    headers
    postData
    time
  }

  # Monitor third-party APIs
  apiRequest: waitForRequest(url: "https://api.thirdparty.com/**") {
    method
    url
    time
  }
}
```

#### E-commerce Request Monitoring

```bql
mutation EcommerceMonitoring {
  # Navigate to shop
  goto(url: "https://shop.example.com") {
    status
  }

  # Add item to cart
  click(selector: "button.add-to-cart") {
    selector
  }

  # Monitor cart API request
  cartRequest: waitForRequest(
    method: POST
    url: "**/cart**"
  ) {
    method
    url
    headers
    postData
    time
  }

  # Proceed to checkout
  click(selector: "button.checkout") {
    selector
  }

  # Monitor payment processing
  paymentRequest: waitForRequest(
    method: POST
    url: "**/payment**"
    timeout: 60000
  ) {
    method
    url
    headers
    postData
    time
  }
}
```

#### Advanced Request Filtering

```bql
mutation AdvancedRequestFiltering {
  # Navigate to complex application
  goto(url: "https://complex-app.example.com") {
    status
  }

  # Monitor GraphQL requests
  graphqlRequest: waitForRequest(
    method: POST
    url: "**/graphql"
  ) {
    method
    url
    headers
    postData
    time
  }

  # Monitor WebSocket upgrades
  websocketRequest: waitForRequest(
    method: GET
    url: "**/websocket**"
  ) {
    method
    url
    headers
    time
  }

  # Monitor API versioning
  versionedRequest: waitForRequest(url: "**/v1/api/**") {
    method
    url
    headers
    time
  }
}
```

#### Performance Analysis Workflow

```bql
mutation PerformanceAnalysis {
  # Navigate to performance test page
  goto(url: "https://performance.example.com") {
    status
  }

  # Monitor initial resource loading
  initialRequest: waitForRequest(
    timeout: 15000
  ) {
    method
    url
    time
  }

  # Trigger user interaction
  click(selector: "button.heavy-operation") {
    selector
  }

  # Monitor subsequent requests
  heavyRequest: waitForRequest(
    method: POST
    url: "**/heavy-operation**"
    timeout: 120000
  ) {
    method
    url
    headers
    postData
    time
  }

  # Performance metrics analysis
  performanceMetrics: evaluate(expression: `
    return {
      requestTime: ${heavyRequest.time},
      totalRequests: performance.getEntriesByType('resource').length,
      navigationTiming: performance.timing.loadEventEnd - performance.timing.navigationStart,
      networkRequests: performance.getEntriesByType('resource').map(r => ({
        name: r.name,
        duration: r.duration,
        size: r.transferSize
      }))
    };
  `) {
    value
  }
}
```

#### waitForRequest Parameters

- **method** (Method, optional): The HTTP method of the request to wait for (GET, POST, PUT, DELETE, etc.)
- **timeout** (Float, optional): How long to wait for the request to be made before timing out, overriding any defaults. Default timeout is 30 seconds, or 30000
- **url** (String, optional): The pattern of the request URL to wait for, using glob-style pattern-matching

#### Method Types

- **GET**: Standard HTTP GET requests for data retrieval
- **POST**: HTTP POST requests for data submission
- **PUT**: HTTP PUT requests for data updates
- **DELETE**: HTTP DELETE requests for resource removal
- **PATCH**: HTTP PATCH requests for partial updates
- **HEAD**: HTTP HEAD requests for metadata
- **OPTIONS**: HTTP OPTIONS requests for CORS preflight

#### URL Pattern Matching

waitForRequest supports glob-style pattern matching for flexible URL filtering:

- `**` - Matches any number of characters including path separators
- `*` - Matches any number of characters except path separators  
- `?` - Matches exactly one character
- `{option1,option2}` - Matches any of the specified options
- `[abc]` - Matches any character in the brackets

#### WaitForRequest Response Fields

- **method**: String containing the HTTP method of the captured request
- **url**: String containing the URL of the captured network request
- **headers**: String containing the headers of the captured network request
- **postData**: String containing the POST data or request body of the captured request
- **time**: Float containing the time taken to capture the network request in milliseconds

#### waitForRequest Benefits

- **📡 Network Monitoring**: Comprehensive monitoring of browser network requests
- **🎯 Selective Filtering**: Filter requests by method, URL pattern, or timeout
- **📊 Performance Analysis**: Track request timing and payload data
- **🔍 Debugging Support**: Capture request details for troubleshooting
- **⚡ Real-time Capture**: Immediate notification when matching requests occur
- **🔒 Security Testing**: Monitor sensitive API calls and data transmission
- **📈 Load Testing**: Analyze request patterns under different conditions
- **🌐 Integration Testing**: Verify third-party API communications

#### Common waitForRequest Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **API Monitoring** | `waitForRequest(method: POST, url: "**/api/**")` | Monitor API endpoint calls |
| **Form Submission** | `waitForRequest(method: POST, url: "**/login**")` | Capture form POST requests |
| **AJAX Calls** | `waitForRequest(method: GET, url: "**/ajax/**")` | Monitor dynamic content loading |
| **Resource Loading** | `waitForRequest(url: "**/*.{js,css,png}")` | Track asset loading |
| **Third-Party APIs** | `waitForRequest(url: "https://api.external.com/**")` | Monitor external integrations |
| **GraphQL** | `waitForRequest(method: POST, url: "**/graphql")` | Capture GraphQL requests |
| **Analytics** | `waitForRequest(url: "**/analytics/**")` | Monitor tracking requests |
| **File Upload** | `waitForRequest(method: POST, timeout: 120000)` | Capture upload requests |

#### Request Types and Patterns

**API Requests:**
- REST API endpoints (`**/api/**`)
- GraphQL endpoints (`**/graphql`)
- Microservice communications (`**/service/**`)
- Webhook deliveries (`**/webhook**`)

**Resource Requests:**
- JavaScript files (`**/*.js`)
- CSS stylesheets (`**/*.css`)
- Images (`**/*.{jpg,png,gif,webp}`)
- Fonts (`**/*.{woff,woff2,ttf}`)
- Media (`**/*.{mp4,webm,mp3}`)

**Authentication Requests:**
- Login endpoints (`**/login**`, `**/auth**`)
- Token refresh (`**/refresh-token**`)
- OAuth flows (`**/oauth/**`)
- Session management (`**/session**`)

#### Integration Patterns

- **API Testing**: Monitor REST and GraphQL API communications
- **Form Testing**: Capture form submission requests for validation
- **Performance Testing**: Track request timing and resource loading
- **Security Testing**: Monitor sensitive data transmission
- **Integration Testing**: Verify third-party service communications
- **Analytics Testing**: Capture tracking and metrics requests
- **E-commerce Testing**: Monitor cart, payment, and order processing

#### Best Practices

- **🎯 Specific Patterns**: Use specific URL patterns to avoid capturing unrelated requests
- **⏱️ Appropriate Timeouts**: Set realistic timeouts based on expected request timing
- **📊 Monitor Critical Paths**: Focus on business-critical API endpoints
- **🔍 Request Validation**: Verify captured request data matches expectations
- **📈 Performance Tracking**: Monitor request timing for performance optimization
- **🛡️ Security Monitoring**: Capture sensitive requests for security validation
- **🔄 Error Handling**: Handle cases where expected requests don't occur

#### Error Handling

- **Request Timeout**: Occurs when no matching request is found within timeout period
- **Pattern Mismatch**: No requests match the specified URL pattern or method
- **Network Issues**: Browser network errors prevent request capture
- **Invalid Patterns**: Malformed glob patterns in URL filtering
- **Method Conflicts**: Specified method doesn't match actual request method

#### Performance Characteristics

- **Fast Detection**: Request detection is typically under 50ms
- **Low Overhead**: Minimal impact on page performance during monitoring
- **Accurate Timing**: Precise measurement of request duration and timing
- **Memory Efficient**: Minimal memory usage for request data capture
- **Real-time Capture**: Immediate notification when matching requests occur

#### Troubleshooting

**Common Issues:**
- Request not captured: Check URL pattern matching and method filters
- Timeout errors: Increase timeout value or verify request is actually made
- Pattern matching: Ensure glob patterns correctly match target URLs
- Timing issues: Consider request delays and network conditions

**Debugging Tips:**
- Use browser developer tools to identify actual request patterns
- Start with broad patterns and narrow down to specific requirements
- Monitor network tab to verify requests are being made
- Test patterns with different timeout values to find optimal settings

The waitForRequest operation provides essential network monitoring capabilities for comprehensive testing, debugging, and performance analysis of web applications with real-time request capture and detailed timing information.

### waitForResponse Operation (waitForResponse)

Waits for a particular network response to be made back to the browser, essential for monitoring API responses, server communications, and response status validation. The waitForResponse operation provides comprehensive response monitoring capabilities for debugging, testing, and performance analysis.

#### Basic waitForResponse Usage

```bql
mutation BasicWaitForResponse {
  # Navigate to page that receives responses
  goto(url: "https://browserless.io") {
    status
  }

  # Wait for any response
  waitForResponse {
    status
    url
    time
  }
}
```

#### API Response Monitoring

```bql
mutation APIResponseMonitoring {
  # Navigate to application
  goto(url: "https://app.example.com") {
    status
  }

  # Wait for successful API response
  apiResponse: waitForResponse(
    statuses: [200, 201]
    url: "**/api/users**"
  ) {
    status
    url
    headers
    body
    time
  }

  # Verify response data
  content: text(selector: ".user-data") {
    text
  }
}
```

#### Form Submission Response Monitoring

```bql
mutation FormResponseMonitoring {
  # Navigate to contact form
  goto(url: "https://contact.example.com") {
    status
  }

  # Fill form fields
  type(selector: "input[name='email']", text: "user@example.com") {
    time
  }

  type(selector: "textarea[name='message']", text: "Contact inquiry") {
    time
  }

  # Submit form
  click(selector: "button[type='submit']") {
    selector
  }

  # Monitor form submission response
  formResponse: waitForResponse(
    statuses: [200, 400, 422]
    url: "**/contact**"
  ) {
    status
    url
    headers
    body
    time
  }
}
```

#### Error Response Monitoring

```bql
mutation ErrorResponseMonitoring {
  # Navigate to application
  goto(url: "https://app.example.com") {
    status
  }

  # Trigger potential error
  click(selector: "button.risky-operation") {
    selector
  }

  # Monitor error responses
  errorResponse: waitForResponse(
    statuses: [400, 401, 403, 404, 500]
    url: "**/api/**"
  ) {
    status
    url
    headers
    body
    time
  }

  # Handle error response
  errorMessage: text(selector: ".error-message") {
    text
  }
}
```

#### Authentication Response Monitoring

```bql
mutation AuthResponseMonitoring {
  # Navigate to login page
  goto(url: "https://login.example.com") {
    status
  }

  # Fill login form
  type(selector: "input[name='username']", text: "testuser") {
    time
  }

  type(selector: "input[name='password']", text: "password123") {
    time
  }

  # Submit login
  click(selector: "button[type='submit']") {
    selector
  }

  # Monitor authentication response
  authResponse: waitForResponse(
    statuses: [200, 401, 403]
    url: "**/login**"
  ) {
    status
    url
    headers
    body
    time
  }

  # Monitor token refresh response
  tokenResponse: waitForResponse(
    statuses: [200, 401]
    url: "**/refresh-token**"
  ) {
    status
    url
    headers
    body
    time
  }
}
```

#### E-commerce Response Monitoring

```bql
mutation EcommerceResponseMonitoring {
  # Navigate to shop
  goto(url: "https://shop.example.com") {
    status
  }

  # Add item to cart
  click(selector: "button.add-to-cart") {
    selector
  }

  # Monitor cart response
  cartResponse: waitForResponse(
    statuses: [200, 400]
    url: "**/cart**"
  ) {
    status
    url
    headers
    body
    time
  }

  # Proceed to payment
  click(selector: "button.checkout") {
    selector
  }

  # Monitor payment processing response
  paymentResponse: waitForResponse(
    statuses: [200, 402, 422]
    url: "**/payment**"
    timeout: 60000
  ) {
    status
    url
    headers
    body
    time
  }
}
```

#### File Upload Response Monitoring

```bql
mutation FileUploadResponseMonitoring {
  # Navigate to upload page
  goto(url: "https://upload.example.com") {
    status
  }

  # Upload file
  type(selector: "input[type='file']", text: "/path/to/file.jpg") {
    time
  }

  click(selector: "button[type='submit']") {
    selector
  }

  # Monitor upload response
  uploadResponse: waitForResponse(
    statuses: [200, 413, 422]
    url: "**/upload**"
    timeout: 120000
  ) {
    status
    url
    headers
    body
    time
  }

  # Verify upload success
  uploadMessage: text(selector: ".upload-status") {
    text
  }
}
```

#### GraphQL Response Monitoring

```bql
mutation GraphQLResponseMonitoring {
  # Navigate to GraphQL application
  goto(url: "https://graphql-app.example.com") {
    status
  }

  # Trigger GraphQL query
  click(selector: "button.execute-query") {
    selector
  }

  # Monitor GraphQL response
  graphqlResponse: waitForResponse(
    statuses: [200, 400]
    url: "**/graphql"
  ) {
    status
    url
    headers
    body
    time
  }

  # Verify GraphQL data
  graphqlData: text(selector: ".query-result") {
    text
  }
}
```

#### Performance Response Analysis

```bql
mutation PerformanceResponseAnalysis {
  # Navigate to performance test page
  goto(url: "https://performance.example.com") {
    status
  }

  # Monitor initial response
  initialResponse: waitForResponse(
    statuses: [200]
    timeout: 15000
  ) {
    status
    url
    headers
    body
    time
  }

  # Trigger heavy operation
  click(selector: "button.heavy-operation") {
    selector
  }

  # Monitor heavy operation response
  heavyResponse: waitForResponse(
    statuses: [200, 504]
    url: "**/heavy-operation**"
    timeout: 120000
  ) {
    status
    url
    headers
    body
    time
  }

  # Performance analysis
  performanceMetrics: evaluate(expression: `
    return {
      initialResponseTime: ${initialResponse.time},
      heavyResponseTime: ${heavyResponse.time},
      totalResponseTime: ${initialResponse.time} + ${heavyResponse.time},
      statusCodes: [${initialResponse.status}, ${heavyResponse.status}],
      timestamp: Date.now(),
      performanceEntries: performance.getEntriesByType('resource').length
    };
  `) {
    value
  }
}
```

#### waitForResponse Parameters

- **statuses** ([Int], optional): The HTTP Response code(s) of the URL to wait for. Can be a single HTTP code or a list of desired codes
- **url** (String, optional): The pattern of the response URL to wait for, using glob-style pattern-matching
- **timeout** (Float, optional): How long to wait for the response before timing out, overriding any defaults. Default timeout is 30 seconds, or 30000
- **codes** ([Int], optional): **DEPRECATED** - Use `statuses` field instead as it is more consistent in BrowserQL

#### Status Code Categories

**Success Codes (2xx):**
- **200**: OK - Standard successful response
- **201**: Created - Resource successfully created
- **202**: Accepted - Request accepted for processing
- **204**: No Content - Successful with no response body

**Client Error Codes (4xx):**
- **400**: Bad Request - Invalid request syntax
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Access denied
- **404**: Not Found - Resource not found
- **422**: Unprocessable Entity - Validation errors

**Server Error Codes (5xx):**
- **500**: Internal Server Error - Generic server error
- **502**: Bad Gateway - Invalid response from upstream
- **503**: Service Unavailable - Service temporarily unavailable
- **504**: Gateway Timeout - Upstream server timeout

#### URL Pattern Matching

waitForResponse supports glob-style pattern matching for flexible URL filtering:

- `**` - Matches any number of characters including path separators
- `*` - Matches any number of characters except path separators  
- `?` - Matches exactly one character
- `{option1,option2}` - Matches any of the specified options
- `[abc]` - Matches any character in the brackets

#### WaitForResponse Response Fields

- **status**: Int containing the HTTP status code of the captured response
- **url**: String containing the URL of the captured network response
- **headers**: String containing the headers of the captured network response
- **body**: String containing the response body content of the captured response
- **time**: Float containing the time taken to capture the network response in milliseconds

#### waitForResponse Benefits

- **📨 Response Monitoring**: Comprehensive monitoring of server responses
- **🎯 Status Filtering**: Filter responses by status codes and URL patterns
- **📊 Performance Analysis**: Track response timing and payload data
- **🔍 Debugging Support**: Capture response details for troubleshooting
- **⚡ Real-time Capture**: Immediate notification when matching responses occur
- **🔒 Security Testing**: Monitor error responses and sensitive data
- **📈 Load Testing**: Analyze response patterns under different conditions
- **🌐 Integration Testing**: Verify API response handling

#### Common waitForResponse Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **Success Monitoring** | `waitForResponse(statuses: [200, 201, 202])` | Monitor successful operations |
| **Error Handling** | `waitForResponse(statuses: [400, 404, 500])` | Capture error responses |
| **Authentication** | `waitForResponse(statuses: [200, 401], url: "**/login**")` | Monitor auth responses |
| **API Endpoints** | `waitForResponse(statuses: [200], url: "**/api/**")` | Track API responses |
| **Form Submission** | `waitForResponse(statuses: [200, 422], url: "**/submit**")` | Monitor form responses |
| **File Upload** | `waitForResponse(statuses: [200, 413], timeout: 120000)` | Capture upload responses |
| **Payment Processing** | `waitForResponse(statuses: [200, 402], url: "**/payment**")` | Monitor payment responses |
| **GraphQL** | `waitForResponse(statuses: [200, 400], url: "**/graphql")` | Capture GraphQL responses |

#### Response Types and Patterns

**API Responses:**
- REST API endpoints (`**/api/**`)
- GraphQL endpoints (`**/graphql`)
- Microservice responses (`**/service/**`)
- Webhook responses (`**/webhook**`)

**Authentication Responses:**
- Login endpoints (`**/login**`, `**/auth**`)
- Token refresh (`**/refresh-token**`)
- OAuth responses (`**/oauth/**`)
- Session management (`**/session**`)

**Business Operation Responses:**
- E-commerce (`**/cart**`, `**/payment**`, `**/order**`)
- Form submissions (`**/contact**`, `**/subscribe**`)
- File operations (`**/upload**`, `**/download**`)
- Search operations (`**/search**`)

#### Integration Patterns

- **API Testing**: Monitor REST and GraphQL API response handling
- **Form Testing**: Capture form submission responses for validation
- **Error Testing**: Monitor error response patterns and handling
- **Performance Testing**: Track response timing and server performance
- **Security Testing**: Monitor authentication and authorization responses
- **Integration Testing**: Verify third-party service response handling
- **E-commerce Testing**: Monitor payment and transaction responses

#### Best Practices

- **🎯 Specific Status Codes**: Use specific status code ranges to avoid capturing unrelated responses
- **⏱️ Appropriate Timeouts**: Set realistic timeouts based on expected response timing
- **📊 Monitor Critical Paths**: Focus on business-critical API response patterns
- **🔍 Response Validation**: Verify captured response data matches expectations
- **📈 Performance Tracking**: Monitor response timing for performance optimization
- **🛡️ Error Monitoring**: Capture error responses for debugging and alerting
- **🔄 Success Verification**: Monitor successful responses to verify operations completed

#### Error Handling

- **Response Timeout**: Occurs when no matching response is found within timeout period
- **Status Mismatch**: No responses match the specified status codes
- **Pattern Mismatch**: No responses match the specified URL pattern
- **Network Issues**: Browser network errors prevent response capture
- **Invalid Patterns**: Malformed glob patterns in URL filtering

#### Performance Characteristics

- **Fast Detection**: Response detection is typically under 50ms
- **Low Overhead**: Minimal impact on page performance during monitoring
- **Accurate Timing**: Precise measurement of response duration and timing
- **Memory Efficient**: Minimal memory usage for response data capture
- **Real-time Capture**: Immediate notification when matching responses occur

#### Troubleshooting

**Common Issues:**
- Response not captured: Check URL pattern matching and status code filters
- Timeout errors: Increase timeout value or verify response is actually received
- Pattern matching: Ensure glob patterns correctly match target URLs
- Status code issues: Verify expected status codes match actual server responses

**Debugging Tips:**
- Use browser developer tools to identify actual response patterns
- Start with broad patterns and narrow down to specific requirements
- Monitor network tab to verify responses are being received
- Test patterns with different timeout values to find optimal settings
- Check server logs to verify expected responses are being sent

The waitForResponse operation provides essential response monitoring capabilities for comprehensive testing, debugging, and performance analysis of web applications with real-time response capture and detailed status information.

### waitForSelector Operation (waitForSelector)

Waits for a given selector to be present in the DOM, with optional visibility checking for element timing and synchronization. The waitForSelector operation provides essential DOM element waiting capabilities for reliable web automation and testing.

#### Basic waitForSelector Usage

```bql
mutation BasicWaitForSelector {
  # Navigate to page
  goto(url: "https://example.com") {
    status
  }

  # Wait for basic element
  basicWait: waitForSelector(selector: "h1") {
    selector
    visible
    time
  }
}
```

#### Element Visibility Waiting

```bql
mutation ElementVisibilityWaiting {
  # Navigate to dynamic application
  goto(url: "https://spa-app.example.com") {
    status
  }

  # Wait for visible element
  visibleElement: waitForSelector(
    selector: ".dynamic-content"
    visible: true
  ) {
    selector
    visible
    time
  }

  # Wait for loading to complete (element becomes invisible)
  loadingComplete: waitForSelector(
    selector: ".loading-spinner"
    visible: false
    timeout: 60000
  ) {
    selector
    visible
    time
  }
}
```

#### Form Element Synchronization

```bql
mutation FormElementSync {
  # Navigate to form page
  goto(url: "https://form-app.example.com") {
    status
  }

  # Wait for form to be ready
  formReady: waitForSelector(
    selector: "form.contact-form"
    visible: true
  ) {
    selector
    visible
    time
  }

  # Wait for interactive button
  buttonReady: waitForSelector(
    selector: "button.submit-btn:not([disabled])"
    visible: true
  ) {
    selector
    visible
    time
  }

  # Fill form after elements are ready
  type(selector: "input[name='email']", text: "user@example.com") {
    time
  }

  # Click button
  click(selector: "button.submit-btn") {
    selector
  }
}
```

#### Dynamic Content Loading

```bql
mutation DynamicContentLoading {
  # Navigate to AJAX application
  goto(url: "https://ajax-app.example.com") {
    status
  }

  # Trigger content loading
  click(selector: "button.load-content") {
    selector
  }

  # Wait for dynamic content with data attributes
  dynamicContent: waitForSelector(
    selector: "[data-loaded='true']"
    timeout: 45000
    visible: true
  ) {
    selector
    visible
    time
  }

  # Wait for specific class states
  contentReady: waitForSelector(
    selector: ".ready, .loaded, .complete"
    visible: true
  ) {
    selector
    visible
    time
  }
}
```

#### Modal and Popup Handling

```bql
mutation ModalPopupHandling {
  # Navigate to application with modals
  goto(url: "https://modal-app.example.com") {
    status
  }

  # Trigger modal
  click(selector: "button.open-modal") {
    selector
  }

  # Wait for modal to appear
  modalAppear: waitForSelector(
    selector: ".modal, .popup, .overlay"
    visible: true
    timeout: 30000
  ) {
    selector
    visible
    time
  }

  # Interact with modal content
  click(selector: ".modal button.confirm") {
    selector
  }

  # Wait for modal to disappear
  modalClose: waitForSelector(
    selector: ".modal"
    visible: false
    timeout: 10000
  ) {
    selector
    visible
    time
  }
}
```

#### Navigation and Page Load Synchronization

```bql
mutation NavigationSync {
  # Navigate to SPA
  goto(url: "https://spa-navigation.example.com") {
    status
  }

  # Wait for initial page load
  pageReady: waitForSelector(
    selector: "body.loaded, .main-content"
    visible: true
    timeout: 30000
  ) {
    selector
    visible
    time
  }

  # Navigate to different section
  click(selector: "nav a[href='/dashboard']") {
    selector
  }

  # Wait for navigation to complete
  dashboardReady: waitForSelector(
    selector: ".dashboard-container[data-loaded='true']"
    visible: true
    timeout: 20000
  ) {
    selector
    visible
    time
  }
}
```

#### waitForSelector Parameters

- **selector** (String!, required): The selector to wait for until present in the DOM
- **timeout** (Float, optional): When waiting for a selector applies a timeout to wait for in milliseconds, overriding any defaults. Default timeout is 30 seconds, or 30000
- **visible** (Boolean, optional): Whether or not to consider the element as present only if it's visible. Default is false

#### CSS Selector Types

**Basic Selectors:**
- **Element**: `div`, `p`, `h1`, `button`
- **Class**: `.class-name`, `.content`, `.button`
- **ID**: `#element-id`, `#main-content`
- **Attribute**: `[data-loaded]`, `[href*="example"]`

**Complex Selectors:**
- **Descendant**: `.parent .child`, `nav a`
- **Child**: `.parent > .child`, `ul > li`
- **Adjacent**: `.first + .second`, `h1 + p`
- **Pseudo-classes**: `:visible`, `:not(.hidden)`, `:first-child`

**Advanced Patterns:**
- **Multiple**: `.class1, .class2, #id1`
- **Attribute matching**: `[data-state='ready']`
- **Partial attribute**: `[class*='button']`
- **Complex combinations**: `form.ready input:not([disabled])`

#### WaitForSelector Response Fields

- **selector**: String containing the selector that was successfully found in the DOM
- **visible**: Boolean indicating whether the found element is visible or not
- **time**: Float containing the time taken to find the selector in milliseconds

#### waitForSelector Benefits

- **⏳ Element Synchronization**: Wait for DOM elements to be present before interaction
- **👁️ Visibility Control**: Optional visibility checking for truly interactive elements
- **🎯 Precise Targeting**: Support for complex CSS selectors and patterns
- **⚡ Fast Detection**: Efficient DOM monitoring with minimal overhead
- **🔍 Debugging Support**: Clear timing and visibility information for troubleshooting
- **🚀 Automation Reliability**: Prevent race conditions in dynamic applications
- **📱 Responsive Design**: Handle elements that appear/disappear based on screen size
- **🔄 Dynamic Content**: Perfect for SPA and AJAX-heavy applications

#### Common waitForSelector Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **Basic Presence** | `waitForSelector(selector: ".element")` | Wait for any element presence |
| **Visible Elements** | `waitForSelector(selector: ".button", visible: true)` | Wait for interactive elements |
| **Form Ready** | `waitForSelector(selector: "form.ready", visible: true)` | Wait for forms to be ready |
| **Loading Complete** | `waitForSelector(selector: ".loading", visible: false)` | Wait for loading to finish |
| **Dynamic Content** | `waitForSelector(selector: "[data-loaded='true']")` | Wait for AJAX content |
| **Modal Appearance** | `waitForSelector(selector: ".modal", visible: true)` | Wait for popups/modals |
| **Navigation Ready** | `waitForSelector(selector: ".page-ready", timeout: 60000)` | Wait for page transitions |
| **Complex Elements** | `waitForSelector(selector: "form input:not([disabled])")` | Wait for specific states |

#### Element State Types

**Visibility States:**
- **Visible**: Element is displayed and interactive (`visible: true`)
- **Present**: Element exists in DOM but may be hidden (`visible: false`)
- **Interactive**: Element is clickable and not disabled
- **Loading**: Element exists but content is still loading

**Dynamic States:**
- **Data Loaded**: `[data-loaded='true']`, `[data-state='ready']`
- **Class Based**: `.loaded`, `.ready`, `.complete`, `.active`
- **Pseudo States**: `:not(.hidden)`, `:not([disabled])`
- **Content Ready**: Elements with specific text or attributes

#### Integration Patterns

- **Form Testing**: Wait for form elements before filling/submitting
- **SPA Navigation**: Synchronize with single-page application routing
- **AJAX Content**: Wait for dynamically loaded content to appear
- **Modal Interactions**: Handle popup and overlay synchronization
- **Image/Media Loading**: Wait for visual assets to load completely
- **Table/List Data**: Synchronize with data population and pagination
- **Responsive Design**: Handle elements that appear on different screen sizes
- **Animation Completion**: Wait for CSS animations and transitions

#### Best Practices

- **🎯 Specific Selectors**: Use precise selectors to avoid false positives
- **👁️ Visibility When Needed**: Use `visible: true` for interactive elements
- **⏱️ Appropriate Timeouts**: Set realistic timeouts based on content complexity
- **📊 State Indicators**: Use data attributes for reliable state detection
- **🔄 Loading States**: Wait for loading indicators to disappear
- **🎨 Responsive Testing**: Consider different screen sizes and breakpoints
- **⚡ Performance**: Prefer simpler selectors for better performance
- **🔍 Debugging**: Use descriptive aliases for element references

#### Error Handling

- **Element Timeout**: Occurs when element is not found within timeout period
- **Selector Invalid**: Malformed CSS selectors cause operation failure
- **Visibility Mismatch**: Element exists but visibility requirement not met
- **DOM Changes**: Dynamic DOM modifications may affect element detection
- **Performance Issues**: Complex selectors may impact detection speed

#### Performance Characteristics

- **Fast Detection**: Element detection is typically under 50ms for simple selectors
- **Low Overhead**: Minimal impact on page performance during waiting
- **Accurate Timing**: Precise measurement of element appearance timing
- **Memory Efficient**: Minimal memory usage for DOM monitoring
- **Scalable Monitoring**: Handles multiple concurrent element waits efficiently

#### Troubleshooting

**Common Issues:**
- Element not found: Verify selector syntax and element existence
- Timeout errors: Increase timeout or check if element actually appears
- Visibility issues: Check CSS styles and element computed visibility
- Selector specificity: Ensure selector uniquely identifies target element

**Debugging Tips:**
- Use browser developer tools to test selectors in console
- Start with broad selectors and narrow down to specific requirements
- Monitor element states and attributes in DevTools
- Test selectors across different page states and screen sizes
- Use descriptive aliases for better error reporting and debugging

The waitForSelector operation provides essential DOM synchronization capabilities for reliable web automation, ensuring elements are ready for interaction before proceeding with subsequent operations in dynamic web applications.

### waitForTimeout Operation (waitForTimeout)

Wait for a period of time, defined in milliseconds, useful for adding delays and timing control in automation workflows. The waitForTimeout operation provides essential timing control capabilities for workflow synchronization and operation pacing.

#### Basic waitForTimeout Usage

```bql
mutation BasicWaitForTimeout {
  # Basic timeout - wait 1 second
  basicWait: waitForTimeout(time: 1000) {
    time
  }
}
```

#### Animation and Transition Timing

```bql
mutation AnimationTiming {
  # Trigger animation
  click(selector: "button.animate") {
    selector
  }

  # Wait for animation to complete
  animationWait: waitForTimeout(time: 800) {
    time
  }

  # Interact with element after animation
  click(selector: ".animated-element") {
    selector
  }
}
```

#### Navigation and Page Settlement

```bql
mutation NavigationTiming {
  # Navigate to page
  goto(url: "https://example.com") {
    status
  }
  
  # Wait for page to settle
  pageSettlement: waitForTimeout(time: 2000) {
    time
  }

  # Continue with interactions
  click(selector: "button.ready") {
    selector
  }
}
```

#### Form Interaction Timing

```bql
mutation FormTiming {
  # Fill form field
  type(selector: "input[name='email']", text: "user@example.com") {
    time
  }

  # Wait for validation processing
  validationWait: waitForTimeout(time: 1000) {
    time
  }

  # Submit after validation
  click(selector: "button[type='submit']") {
    selector
  }
}
```

#### API and Processing Delays

```bql
mutation APITiming {
  # Trigger API call
  click(selector: "button.api-call") {
    selector
  }

  # Wait for API processing
  apiWait: waitForTimeout(time: 4000) {
    time
  }

  # Check result after processing
  result: text(selector: ".api-result") {
    text
  }
}
```

#### Interaction Pacing

```bql
mutation InteractionPacing {
  # First action
  click(selector: "button.first") {
    selector
  }
  
  # Pace between actions
  actionDelay: waitForTimeout(time: 1500) {
    time
  }
  
  # Second action
  click(selector: "button.second") {
    selector
  }

  # Another paced delay
  secondDelay: waitForTimeout(time: 1000) {
    time
  }

  # Final action
  click(selector: "button.final") {
    selector
  }
}
```

#### Debounce and Throttling

```bql
mutation DebounceTiming {
  # Rapid input that triggers debounced search
  type(selector: "input[type='search']", text: "search query") {
    time
  }

  # Wait for debounce period
  debounceWait: waitForTimeout(time: 1200) {
    time
  }

  # Check search results after debounce
  searchResults: text(selector: ".search-results") {
    text
  }
}
```

#### Performance Timing Workflow

```bql
mutation PerformanceTiming {
  # Navigate to performance test page
  goto(url: "https://performance.example.com") {
    status
  }

  # Initial settlement
  initialWait: waitForTimeout(time: 2000) {
    time
  }

  # Trigger heavy operation
  click(selector: "button.heavy-operation") {
    selector
  }

  # Wait for processing
  processingWait: waitForTimeout(time: 5000) {
    time
  }

  # Performance analysis
  performanceMetrics: evaluate(expression: `
    return {
      initialWaitTime: ${initialWait.time},
      processingWaitTime: ${processingWait.time},
      totalWaitTime: ${initialWait.time} + ${processingWait.time},
      timestamp: Date.now(),
      performanceNow: performance.now()
    };
  `) {
    value
  }
}
```

#### waitForTimeout Parameters

- **time** (Float!, required): The amount of time to wait for, in milliseconds

#### Common Timing Values

**Animation Delays:**
- **300ms**: Quick hover effects and micro-interactions
- **500ms**: Standard UI transitions and animations
- **800ms**: Longer animations and modal transitions
- **1000ms**: Complex animations and state changes

**Processing Delays:**
- **1000ms**: Form validation and quick processing
- **2000ms**: Page settlement and initial loading
- **3000ms**: Network request processing
- **5000ms**: Heavy server-side operations

**Interaction Pacing:**
- **500ms**: Quick action sequences
- **1000ms**: Standard interaction pacing
- **1500ms**: Deliberate user-like timing
- **2000ms**: Slow, careful interactions

#### WaitForTimeout Response Fields

- **time**: Float containing the actual time waited in milliseconds

#### waitForTimeout Benefits

- **⏰ Precise Timing Control**: Exact millisecond-level delay control
- **🎬 Animation Synchronization**: Wait for CSS animations and transitions
- **📊 Performance Testing**: Control timing for performance analysis
- **🔄 Workflow Pacing**: Add realistic delays between interactions
- **🌐 Network Settlement**: Allow time for network requests to complete
- **🎯 Debounce Handling**: Respect debounced operations and throttling
- **📱 Responsive Testing**: Account for different device performance
- **🧪 Testing Consistency**: Ensure consistent timing across test runs

#### Common waitForTimeout Scenarios

| Scenario | Configuration | Use Case |
|----------|---------------|----------|
| **Quick Animation** | `waitForTimeout(time: 300)` | Hover effects, micro-interactions |
| **Standard Transition** | `waitForTimeout(time: 800)` | Modal animations, UI transitions |
| **Form Validation** | `waitForTimeout(time: 1000)` | Wait for validation processing |
| **Page Settlement** | `waitForTimeout(time: 2000)` | Allow page to fully load and settle |
| **API Processing** | `waitForTimeout(time: 4000)` | Wait for server-side processing |
| **Heavy Operations** | `waitForTimeout(time: 5000)` | Complex calculations or operations |
| **Network Settlement** | `waitForTimeout(time: 3000)` | Allow network requests to complete |
| **Debounce Period** | `waitForTimeout(time: 1200)` | Respect search/input debouncing |

#### Timing Categories

**Micro-interactions (< 500ms):**
- Button hover effects (200-300ms)
- Tooltip appearances (250-400ms)
- Quick state changes (100-500ms)
- Ripple animations (300-400ms)

**Standard UI (500ms - 1s):**
- Modal opening/closing (600-800ms)
- Tab switching (400-600ms)
- Dropdown animations (300-500ms)
- Form field validation (500-1000ms)

**Process Waiting (1s - 5s):**
- Form submission (1-3s)
- API responses (2-4s)
- Page navigation (1-3s)
- Data processing (2-5s)

**Heavy Operations (5s+):**
- File uploads (5-30s)
- Report generation (5-15s)
- Batch processing (10-60s)
- System operations (5-20s)

#### Integration Patterns

- **Animation Testing**: Wait for CSS animations to complete before verification
- **Form Testing**: Add delays between input for realistic user simulation
- **Performance Testing**: Control timing for consistent performance measurements
- **API Testing**: Allow time for server processing and response handling
- **User Simulation**: Add human-like delays between interactions
- **Load Testing**: Pace operations to simulate realistic usage patterns
- **Cross-browser Testing**: Account for performance differences across browsers
- **Mobile Testing**: Add extra time for slower mobile device performance

#### Best Practices

- **⏰ Realistic Timing**: Use timing values that reflect real user behavior
- **🎯 Purpose-Driven**: Each timeout should have a clear purpose
- **📊 Performance Aware**: Consider different device capabilities
- **🔄 Consistent Pacing**: Maintain consistent timing patterns
- **📱 Mobile Considerations**: Add extra time for mobile devices
- **🧪 Testing Balance**: Don't over-rely on timeouts for synchronization
- **⚡ Optimization**: Prefer element/event waiting over fixed timeouts when possible
- **📈 Gradual Timing**: Start with shorter timeouts and increase as needed

#### Error Handling

- **Timing Accuracy**: Actual wait time may vary slightly from requested time
- **Performance Impact**: Long timeouts can slow down automation execution
- **False Positives**: Fixed timeouts may not account for variable conditions
- **Resource Usage**: Multiple concurrent timeouts consume resources
- **Testing Reliability**: Over-reliance on timeouts can make tests brittle

#### Performance Characteristics

- **Accurate Timing**: Typically accurate within 1-10ms of requested time
- **Low CPU Usage**: Minimal CPU overhead during waiting periods
- **Memory Efficient**: Low memory footprint for timeout operations
- **Scalable**: Handles multiple concurrent timeout operations efficiently
- **Cross-platform**: Consistent behavior across different operating systems

#### Troubleshooting

**Common Issues:**
- Tests too slow: Reduce timeout values where possible
- Timing inconsistency: Account for performance variations across environments
- Over-reliance: Balance timeouts with element-based waiting
- Mobile performance: Increase timeouts for slower mobile devices

**Debugging Tips:**
- Use browser developer tools to measure actual timing
- Profile automation scripts to identify timing bottlenecks
- Test across different devices to validate timing assumptions
- Consider using element/event-based waiting as alternatives
- Monitor system performance during automation execution

**Alternatives to Consider:**
- `waitForSelector` for element-based waiting
- `waitForNavigation` for page load timing
- `waitForRequest`/`waitForResponse` for network timing
- Event-based waiting for more reliable synchronization

The waitForTimeout operation provides essential timing control for automation workflows, enabling precise delays and synchronization for consistent, reliable testing and automation across different environments and conditions.

### browser Query (browser)

Get the version of the browser currently being used for automation and testing. The browser query provides essential browser identification and compatibility information for version-specific automation logic and feature detection.

#### Basic browser Usage

```bql
query BrowserInfo {
  # Get browser version
  browser
}
```

#### Browser Compatibility Checking

```bql
query BrowserCompatibility {
  # Get browser version
  browserVersion: browser

  # Browser compatibility analysis
  compatibilityCheck: evaluate(expression: `
    const browserVersion = "${browserVersion}";
    const isChrome = browserVersion.includes('Chrome');
    const isSafari = browserVersion.includes('Safari');
    const isFirefox = browserVersion.includes('Firefox');
    
    return {
      browserVersion,
      isChrome,
      isSafari,
      isFirefox,
      supported: isChrome || isSafari || isFirefox
    };
  `) {
    value
  }
}
```

#### Browser Feature Detection

```bql
query BrowserFeatureDetection {
  # Get browser version
  browserVersion: browser

  # Feature support analysis
  featureSupport: evaluate(expression: `
    const browser = "${browserVersion}";
    
    // Extract version numbers
    const chromeMatch = browser.match(/Chrome\\/(\\d+)/);
    const safariMatch = browser.match(/Safari\\/(\\d+)/);
    const firefoxMatch = browser.match(/Firefox\\/(\\d+)/);
    
    const version = chromeMatch ? parseInt(chromeMatch[1]) : 
                    safariMatch ? parseInt(safariMatch[1]) : 
                    firefoxMatch ? parseInt(firefoxMatch[1]) : 0;
    
    return {
      browser,
      version,
      supportsWebGL: version > 50,
      supportsES6: version > 45,
      supportsModules: version > 60,
      supportsWebAssembly: version > 57
    };
  `) {
    value
  }
}
```

#### Browser-Specific Testing

```bql
query BrowserTesting {
  # Get browser information
  testInfo: {
    browser
  }

  # Browser-specific test configuration
  browserSpecificTest: evaluate(expression: `
    const browser = "${testInfo.browser}";
    
    return {
      browser,
      testEnvironment: 'development',
      needsPolyfills: browser.includes('Safari'),
      supportsModernJS: browser.includes('Chrome'),
      timestamp: Date.now()
    };
  `) {
    value
  }
}
```

#### Browser Response Fields

- **browser**: String containing the browser version (e.g., "Chrome/119.0.6045.105")

#### browser Benefits

- **🌐 Browser Identification**: Accurate browser version detection
- **🔍 Compatibility Checking**: Version-specific feature availability
- **🧪 Cross-browser Testing**: Browser-specific test logic
- **📊 Feature Detection**: Modern web API support checking
- **🚀 Performance Optimization**: Browser-specific performance tuning
- **🔧 Debug Information**: Essential debugging context
- **📱 Device Detection**: Mobile vs desktop browser identification
- **⚡ Conditional Logic**: Browser-specific automation paths

### version Query (version)

Get the version of the BrowserQL server currently running. The version query provides server version information for compatibility checking and version-specific feature availability.

#### Basic version Usage

```bql
query VersionInfo {
  # Get server version
  version
}
```

#### Version Compatibility Checking

```bql
query VersionCompatibility {
  # Get server version
  serverVersion: version

  # Version compatibility analysis
  compatibilityCheck: evaluate(expression: `
    const version = "${serverVersion}";
    const [major, minor, patch] = version.split('.').map(Number);
    
    return {
      version,
      major,
      minor,
      patch,
      supportsNewFeatures: major >= 2 && minor >= 15,
      isStable: major >= 2,
      requiresUpdate: major < 2 || (major === 2 && minor < 10)
    };
  `) {
    value
  }
}
```

#### Environment Validation

```bql
query EnvironmentCheck {
  # Get system information
  environment: {
    serverVersion: version
  }

  # Environment validation
  envValidation: evaluate(expression: `
    const server = "${environment.serverVersion}";
    
    return {
      server,
      isCompatible: true,
      environment: 'testing',
      checkedAt: new Date().toISOString(),
      recommendations: []
    };
  `) {
    value
  }
}
```

#### System Information Collection

```bql
query SystemInfo {
  # Get server version
  version

  # Complete system analysis
  systemAnalysis: evaluate(expression: `
    return {
      serverVersion: "${version}",
      timestamp: Date.now(),
      environment: 'production',
      session: {
        id: Math.random().toString(36).substr(2, 9),
        startTime: Date.now()
      }
    };
  `) {
    value
  }
}
```

#### version Response Fields

- **version**: String containing the server version (e.g., "2.15.0")

#### version Benefits

- **🔧 Version Tracking**: Current server version identification
- **📋 Compatibility Checking**: Feature availability by version
- **🚀 Update Management**: Version comparison and upgrade planning
- **🧪 Testing Configuration**: Version-specific test setups
- **📊 Debug Information**: Essential troubleshooting context
- **🔄 Migration Planning**: Version-based migration strategies
- **⚡ Performance Optimization**: Version-specific optimizations
- **📈 Feature Detection**: New feature availability checking

### Combined System Information

```bql
query CompleteSystemInfo {
  # Get both browser and server information
  systemInfo: {
    browser
    version
  }

  # Complete system analysis
  fullSystemAnalysis: evaluate(expression: `
    const browser = "${systemInfo.browser}";
    const server = "${systemInfo.version}";
    
    return {
      browser,
      server,
      timestamp: Date.now(),
      environment: 'production',
      compatibility: {
        browserSupported: browser.includes('Chrome') || browser.includes('Firefox'),
        serverSupported: server >= '2.0.0',
        fullyCompatible: true
      },
      debugging: {
        userAgent: navigator.userAgent,
        screen: {
          width: screen.width,
          height: screen.height
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };
  `) {
    value
  }
}
```

#### Common Query Scenarios

| Query Type | Usage | Response |
|------------|-------|----------|
| **Browser Version** | `browser` | Browser version string |
| **Server Version** | `version` | Server version string |
| **System Info** | `{ browser version }` | Combined system information |
| **Compatibility Check** | Version parsing with `evaluate` | Compatibility analysis |
| **Feature Detection** | Browser parsing with `evaluate` | Feature support matrix |
| **Debug Information** | Combined with user agent | Complete debug context |
| **Environment Validation** | Version comparison logic | Environment status |
| **Performance Tuning** | Browser-specific optimizations | Performance recommendations |

#### Query Categories

**Basic Information:**
- Browser version identification
- Server version identification
- Simple compatibility checking
- Debug information gathering

**Advanced Analysis:**
- Feature support detection
- Version compatibility matrices
- Performance optimization recommendations
- Cross-browser compatibility analysis

**System Monitoring:**
- Environment validation
- Update requirement checking
- Compatibility tracking
- Performance baseline establishment

#### Integration Patterns

- **Testing Workflows**: Browser and version-specific test configurations
- **Feature Detection**: Conditional logic based on capabilities
- **Performance Optimization**: Browser-specific performance tuning
- **Debug Logging**: Complete system context for troubleshooting
- **Compatibility Checking**: Automated compatibility validation
- **Environment Validation**: System requirement verification
- **Update Management**: Version tracking and upgrade planning
- **Cross-platform Testing**: Multi-browser automation strategies

#### Best Practices

- **🔍 Regular Checking**: Include system queries in test suites
- **📊 Version Tracking**: Monitor version compatibility over time
- **🧪 Feature Detection**: Use browser capabilities for conditional logic
- **🚀 Performance Aware**: Optimize based on browser capabilities
- **📱 Cross-platform**: Test across different browser versions
- **🔧 Debug Ready**: Include system info in error reporting
- **⚡ Efficient Querying**: Cache query results when appropriate
- **📈 Monitoring**: Track version distributions in production

#### Troubleshooting

**Common Use Cases:**
- Determine browser compatibility for specific features
- Check server version for feature availability
- Validate environment requirements
- Generate debug information for issue reporting
- Plan updates and migrations
- Optimize performance based on capabilities

**Debug Information:**
- Browser version strings help identify compatibility issues
- Server version information assists with feature availability
- Combined system info provides complete troubleshooting context
- User agent strings offer additional browser details

The browser and version queries provide essential system information for building robust, compatible, and well-optimized BrowserQL automation workflows that work reliably across different environments and browser versions.

## Development

To contribute to this extension:

1. Fork the repository
2. Make your changes
3. Submit a pull request

## License

MIT 