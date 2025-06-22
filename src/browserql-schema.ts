/**
 * BrowserQL Schema Definitions
 * 
 * This file contains the type definitions and constants for BrowserQL operations,
 * keywords, and options that are used throughout the extension.
 */

export interface BrowserQLArgument {
    name: string;
    type: string;
    description: string;
    required: boolean;
    defaultValue?: string;
}

export interface BrowserQLReturn {
    name: string;
    type: string;
    description: string;
}

export interface BrowserQLOperation {
    name: string;
    description: string;
    arguments: BrowserQLArgument[];
    returns: BrowserQLReturn[];
    example?: string;
}

export interface BrowserQLDirective {
    name: string;
    description: string;
    arguments: BrowserQLArgument[];
    locations: string[];
    example?: string;
}

/**
 * List of BrowserQL directives with their arguments and usage locations
 */
export const browserQLDirectives: BrowserQLDirective[] = [
    {
        name: 'include',
        description: 'Directs the executor to include this field or fragment only when the `if` argument is true',
        arguments: [
            {
                name: 'if',
                type: 'Boolean!',
                description: 'Included when true',
                required: true
            }
        ],
        locations: ['FIELD', 'FRAGMENT_SPREAD', 'INLINE_FRAGMENT'],
        example: `mutation ConditionalInclude {
  content(html: "<h1>Test</h1>") {
    status
    time @include(if: true)
    url @include(if: false)
  }
}`
    },
    {
        name: 'skip',
        description: 'Directs the executor to skip this field or fragment when the `if` argument is true',
        arguments: [
            {
                name: 'if',
                type: 'Boolean!',
                description: 'Skipped when true',
                required: true
            }
        ],
        locations: ['FIELD', 'FRAGMENT_SPREAD', 'INLINE_FRAGMENT'],
        example: `mutation ConditionalSkip {
  content(html: "<h1>Test</h1>") {
    status
    time @skip(if: false)
    url @skip(if: true)
  }
}`
    }
];

/**
 * List of BrowserQL operations with their arguments and return types
 */
export const browserQLOperations: BrowserQLOperation[] = [
    {
        name: 'back',
        description: 'Goes back in browser history, optionally accepting waitUntil and timeout arguments. Returns null if no back is possible',
        arguments: [
            {
                name: 'timeout',
                type: 'Float',
                description: 'The maximum amount of time, in milliseconds, to wait for the page to load, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false
            },
            {
                name: 'waitUntil',
                type: 'WaitUntilHistory',
                description: 'When to consider the page fully-loaded and proceed with further execution',
                required: false,
                defaultValue: 'load'
            }
        ],
        returns: [
            {
                name: 'status',
                type: 'Int',
                description: 'The status code response of the initial page-load'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'The amount of time, in milliseconds, elapsed since the start of navigation to completion'
            },
            {
                name: 'text',
                type: 'String',
                description: 'The status text of the response from the initial page-load. Generally \'ok\''
            },
            {
                name: 'url',
                type: 'String',
                description: 'The final URL of the page after any potential redirects or URL rewrites'
            }
        ],
        example: `mutation GoBack {
  firstNav: goto(url: "https://example.com") {
    time
  }
  
  secondNav: goto(url: "https://browserless.com") {
    time
  }
  
  back(waitUntil: domContentLoaded) {
    status
    time
    text
    url
  }
}`
    },
    {
        name: 'checkbox',
        description: 'Sets or un-sets the value of a checkbox on the page',
        arguments: [
            {
                name: 'checked',
                type: 'Boolean!',
                description: 'Whether or not the input should be checked',
                required: true
            },
            {
                name: 'selector',
                type: 'String!',
                description: 'The CSS selector of the element on the page you want to check/uncheck',
                required: true
            },
            {
                name: 'scroll',
                type: 'Boolean',
                description: 'Whether or not to scroll to the element prior to clicking, defaults to true',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'How long to wait for the element to appear before timing out on the handler, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Whether or not to check/uncheck the element only if it\'s visible',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'wait',
                type: 'Boolean',
                description: 'Whether or not to wait for the element to present in the DOM',
                required: false,
                defaultValue: 'true'
            }
        ],
        returns: [
            {
                name: 'selector',
                type: 'String',
                description: 'The selector text of the clicked element, if specified'
            },
            {
                name: 'x',
                type: 'Float',
                description: 'The x-coordinate of the click, in pixels, on the page'
            },
            {
                name: 'y',
                type: 'Float',
                description: 'The y-coordinate of the click, in pixels, on the page'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'The amount of time, in milliseconds, elapsed since the start of clicking to completion'
            }
        ],
        example: `mutation ClickCheckbox {
  goto(url: "https://example.com") {
    status
  }

  checkbox(
    checked: true
    selector: "input[type='checkbox']"
  ) {
    selector
    x
    y
    time
  }
}`
    },
    {
        name: 'click',
        description: 'Waits for the element to be visible, scrolls to it, then clicks on it with native events',
        arguments: [
            {
                name: 'selector',
                type: 'String!',
                description: 'A query-selector compatible string, JavaScript that returns an HTML Node, OR a Browserless-deep query',
                required: true
            },
            {
                name: 'scroll',
                type: 'Boolean',
                description: 'Whether or not to scroll to the element prior to clicking, defaults to true',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'How long to wait for the element to appear before timing out on the click handler, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Whether or not to click the element only if it\'s visible',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'wait',
                type: 'Boolean',
                description: 'Whether or not to wait for the element to present in the DOM',
                required: false,
                defaultValue: 'true'
            }
        ],
        returns: [
            {
                name: 'selector',
                type: 'String',
                description: 'The selector text of the clicked element, if specified'
            },
            {
                name: 'x',
                type: 'Float',
                description: 'The x-coordinate of the click, in pixels, on the page'
            },
            {
                name: 'y',
                type: 'Float',
                description: 'The y-coordinate of the click, in pixels, on the page'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'The amount of time, in milliseconds, elapsed since the start of clicking to completion'
            }
        ],
        example: `mutation ClickButton {
  goto(url: "https://example.com") {
    status
  }

  click(selector: "a") {
    selector
    x
    y
    time
  }
}`
    },
    {
        name: 'content',
        description: 'Sets the given HTML content on the page with an optional waitUntil parameter',
        arguments: [
            {
                name: 'html',
                type: 'String!',
                description: 'When present, sets the content of page to the value passed, then returns the pages content',
                required: true
            },
            {
                name: 'waitUntil',
                type: 'WaitUntilHistory',
                description: 'When to consider the page fully-loaded and proceed with further execution',
                required: false
            }
        ],
        returns: [
            {
                name: 'status',
                type: 'Int',
                description: 'The status code response of the initial page-load'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'The amount of time, in milliseconds, elapsed since the start of navigation to completion'
            },
            {
                name: 'text',
                type: 'String',
                description: 'The status text of the response from the initial page-load. Generally \'ok\''
            },
            {
                name: 'url',
                type: 'String',
                description: 'The final URL of the page after any potential redirects or URL rewrites'
            }
        ],
        example: `mutation SetContent {
  content(html: "<h1>Hello, World!</h1>") {
    status
    time
    text
    url
  }
}`
    },
    {
        name: 'cookies',
        description: 'Sets and gets cookies on the page',
        arguments: [
            {
                name: 'cookies',
                type: '[CookieInput]',
                description: 'The cookies to set on the page',
                required: false
            }
        ],
        returns: [
            {
                name: 'cookies',
                type: '[StandardCookie]',
                description: 'A standard cookie object with the values of the set cookies'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'The time it took to set and return the cookies'
            }
        ],
        example: `mutation SetCookies {
  # Get the cookies on the page
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

  # Set a cookie on the page
  setCookies: cookies(cookies: [
      {
        name: "my-cookie"
        value: "my-value"
        url: "https://example.com"
        secure: true
        httpOnly: false
        sameSite: Lax
      }
  ]) {
    cookies {
      name
      value
      domain
      path
    }
    time
  }
}`
    },
    {
        name: 'evaluate',
        description: 'Evaluates JavaScript client-side, via raw content or a URL to some JavaScript code, in the browser\'s page environment',
        arguments: [
            {
                name: 'content',
                type: 'String',
                description: 'The raw script you\'d like to evaluate. This code gets wrapped in an async function so you can use `return` at the end as well as `await` and other async concepts. You can return any stringified value from this function',
                required: false
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'A timeout to wait for the script to finish evaluating, overriding any defaults. Useful for async scripts that may be longer running. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'url',
                type: 'String',
                description: 'The URL of the script you\'d like to evaluate. This code gets wrapped in an async function so you can use `return` at the end as well as `await` and other async concepts. You can return any stringified value from this function',
                required: false
            }
        ],
        returns: [
            {
                name: 'value',
                type: 'Any',
                description: 'The result of the evaluated script'
            }
        ],
        example: `mutation EvaluateScript {
  # Simple arithmetic
  byContent: evaluate(content: "2 + 2") {
    value
  }
  
  # Complex async JavaScript with DOM interaction
  complexScript: evaluate(content: \`
    // Get page title and modify it
    const originalTitle = document.title;
    document.title = "Modified by BQL";
    
    // Wait for an element and get its text
    const element = await new Promise(resolve => {
      const check = () => {
        const el = document.querySelector('h1');
        if (el) resolve(el);
        else setTimeout(check, 100);
      };
      check();
    });
    
    // Return complex object
    return {
      originalTitle,
      newTitle: document.title,
      elementText: element.textContent,
      timestamp: Date.now()
    };
  \`) {
    value
  }

  # Load external script
  byUrl: evaluate(url: "https://example.com/script.js") {
    value
  }
}`
    },
    {
        name: 'forward', 
        description: 'Goes forward in browser history, optionally accepting waitUntil and timeout arguments. Returns null if no forward is possible',
        arguments: [
            {
                name: 'timeout',
                type: 'Float',
                description: 'The maximum amount of time, in milliseconds, to wait for the page to load, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'waitUntil',
                type: 'WaitUntilHistory',
                description: 'When to consider the page fully-loaded and proceed with further execution',
                required: false,
                defaultValue: 'load'
            }
        ],
        returns: [
            {
                name: 'status',
                type: 'Int',
                description: 'The status code response of the initial page-load'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'The amount of time, in milliseconds, elapsed since the start of navigation to completion'
            },
            {
                name: 'text',
                type: 'String',
                description: 'The status text of the response from the initial page-load. Generally \'ok\''
            },
            {
                name: 'url',
                type: 'String',
                description: 'The final URL of the page after any potential redirects or URL rewrites'
            }
        ],
        example: `mutation GoForward {
  firstNav: goto(url: "https://example.com", waitUntil: load) {
    time
  }

  secondNav: goto(url: "https://browserless.io", waitUntil: load) {
    time
  }

  back(waitUntil: domContentLoaded) {
    status
  }

  forward(waitUntil: domContentLoaded) {
    status
  }
}`
    },
    {
        name: 'goto',
        description: 'Navigates to a URL with an optional waitUntil parameter and timeout parameter',
        arguments: [
            {
                name: 'url',
                type: 'String!',
                description: 'The fully-qualified URL of the page you\'d like to navigate to',
                required: true
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'The maximum amount of time, in milliseconds, to wait for the page to load, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'waitUntil',
                type: 'WaitUntilGoto',
                description: 'When to consider the page fully-loaded and proceed with further execution',
                required: false,
                defaultValue: 'load'
            }
        ],
        returns: [
            {
                name: 'status',
                type: 'Int',
                description: 'The status code response of the initial page-load'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'The amount of time, in milliseconds, elapsed since the start of navigation to completion'
            },
            {
                name: 'text',
                type: 'String',
                description: 'The status text of the response from the initial page-load. Generally \'ok\''
            },
            {
                name: 'url',
                type: 'String',
                description: 'The final URL of the page after any potential redirects or URL rewrites'
            }
        ],
        example: `mutation Goto {
  goto(url: "https://example.com") {
    status
  }
  
  # With timeout and waitUntil
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
}`
    },
    {
        name: 'hover',
        description: 'Waits for the element to be visible, scrolls to it, then hover on it with native events',
        arguments: [
            {
                name: 'scroll',
                type: 'Boolean',
                description: 'Whether or not to scroll to the element, defaults to true',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'selector',
                type: 'String',
                description: 'The CSS selector of the element on the page you want to hover on',
                required: false
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'How long to wait for the element to appear before timing out, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Whether or not to hover on the element only if it\'s visible',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'wait',
                type: 'Boolean',
                description: 'Whether or not to wait for the element to present in the DOM',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'x',
                type: 'Float',
                description: 'The X coordinate, in pixels, to hover on the page',
                required: false
            },
            {
                name: 'y',
                type: 'Float',
                description: 'The Y coordinate, in pixels, to hover on the page',
                required: false
            }
        ],
        returns: [
            {
                name: 'selector',
                type: 'String',
                description: 'The selector used for hovering'
            },
            {
                name: 'x',
                type: 'Float',
                description: 'The x-coordinate of the hover, in pixels, on the page'
            },
            {
                name: 'y',
                type: 'Float',
                description: 'The y-coordinate of the hover, in pixels, on the page'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'The amount of time, in milliseconds, elapsed since the start of hovering to completion'
            }
        ],
        example: `mutation HoverElement {
  goto(url: "https://example.com") {
    status
  }

  hover(selector: "a") {
    time
  }
  
  # Hover with coordinates
  hover(x: 100, y: 200) {
    x
    y
    time
  }
  
  # Hover with all options
  hover(
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
}`
    },
    {
        name: 'html',
        description: 'Returns the HTML content of the page or selector when specified. This API can also "clean" HTML markup returned by specifying a "clean" argument with numerous options. Features of the "clean" argument include removal of non-text nodes, removal of DOM attributes, as well as removal of excessive whitespace and newlines. Using "clean" can save nearly 1,000 times the payload size. Useful for LLM\'s and other scenarios',
        arguments: [
            {
                name: 'selector',
                type: 'String',
                description: 'The DOM selector of the given element you want to return the HTML of',
                required: false
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'The maximum amount of time, in milliseconds, to wait for the selector to appear, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Whether or not to return the HTML content of the element only if it\'s visible',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'clean',
                type: 'CleanInput',
                description: 'Specifies conditions for "cleaning" HTML, useful for minimizing the amount of markup returned for cases like LLMs and more. See nested options for parameters',
                required: false
            }
        ],
        returns: [
            {
                name: 'html',
                type: 'String',
                description: 'The HTML content of the page or specified element'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'The amount of time, in milliseconds, elapsed during the HTML extraction'
            }
        ],
        example: `mutation GetHTML {
  goto(url: "https://example.com") {
    status
  }
  
  # Basic HTML extraction
  pageHTML: html {
    html
  }
  
  # HTML from specific element
  elementHTML: html(selector: "h1") {
    html
    time
  }
  
  # HTML with visibility check
  visibleHTML: html(
    selector: ".content"
    visible: true
  ) {
    html
    time
  }
  
  # Clean HTML for LLMs - removes attributes and non-text nodes
  cleanHTML: html(clean: {
    removeAttributes: true
    removeNonTextNodes: true
  }) {
    html
    time
  }
  
  # Comprehensive cleaning options
  ultraCleanHTML: html(
    selector: "main"
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
}`
    },
    {
        name: 'if',
        description: 'Triggers a nested branch of work when a given condition is `true`. Does not wait for these items and is a point-in-time check. Use the wait method if you\'re wanting to await certain behaviors to be present',
        arguments: [
            {
                name: 'request',
                type: 'RequestInput',
                description: 'Triggers the nested conditions if a request has been made with the following conditions',
                required: false
            },
            {
                name: 'response',
                type: 'ResponseInput',
                description: 'Triggers the nested conditions if a response has been received with the following conditions',
                required: false
            },
            {
                name: 'selector',
                type: 'String',
                description: 'Triggers the subsequent conditions if the selector is immediately present',
                required: false
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'When using selectors in conditionals this options sets whether their or not to consider if they\'re visible to the viewport',
                required: false,
                defaultValue: 'false'
            }
        ],
        returns: [
            {
                name: 'Mutation',
                type: 'Mutation',
                description: 'Nested mutation operations that execute when the condition is true'
            }
        ],
        example: `mutation ConditionalIf {
  goto(url: "https://example.com") {
    status
  }

  # Will only trigger screenshot if h1 is present
  if(selector: "h1") {
    screenshot {
      base64
    }
  }
  
  # Conditional with visibility check
  if(selector: ".modal", visible: true) {
    click(selector: ".close-button") {
      time
    }
  }
  
  # Multiple nested operations
  if(selector: "form") {
    type(selector: "input[name='email']", text: "test@example.com") {
      time
    }
    click(selector: "button[type='submit']") {
      time
    }
  }
}`
    },
    {
        name: 'ifnot',  
        description: 'Triggers a nested branch of work when a given condition is `false`. This method does not wait for these items and is a point-in-time check. Use the wait method if you\'re wanting to await certain behaviors to be present',
        arguments: [
            {
                name: 'request',
                type: 'RequestInput',
                description: 'Triggers the nested conditions if a request has been made with the following conditions',
                required: false
            },
            {
                name: 'response',
                type: 'ResponseInput',
                description: 'Triggers the nested conditions if a response has been received with the following conditions',
                required: false
            },
            {
                name: 'selector',
                type: 'String',
                description: 'Triggers the subsequent conditions if the selector is immediately present',
                required: false
            }
        ],
        returns: [
            {
                name: 'Mutation',
                type: 'Mutation',
                description: 'Nested mutation operations that execute when the condition is false'
            }
        ],
        example: `mutation ConditionalIfNot {
  goto(url: "https://example.com") {
    status
  }

  # Will only trigger screenshot if h2 is NOT present
  ifnot(selector: "h2") {
    screenshot {
      base64
    }
  }
  
  # Handle missing elements gracefully
  ifnot(selector: ".loading-spinner") {
    # Page has loaded, proceed with actions
    click(selector: "button.primary") {
      time
    }
  }
  
  # Fallback operations when condition is false
  ifnot(selector: ".advanced-form") {
    # Use simple form instead
    type(selector: "input[name='query']", text: "search term") {
      time
    }
  }
}`
    },
    {
        name: 'javaScriptEnabled',
        description: 'Sets and gets JavaScript execution on the page. Note: changing this value won\'t affect scripts that have already been run. It will take full effect on the next navigation.',
        arguments: [
            {
                name: 'enabled',
                type: 'Boolean',
                description: 'Whether or not to enable JavaScript on the page',
                required: false
            }
        ],
        returns: [
            {
                name: 'enabled',
                type: 'Boolean',
                description: 'Current JavaScript execution status on the page'
            }
        ],
        example: `mutation JavaScriptControl {
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
  
  # Navigate to see the effect
  goto(url: "https://example.com") {
    status
    time
  }
}`
    },
    {
        name: 'liveURL',
        description: 'Returns a fully-qualified, user-shareable live-URL for streaming the web-browser to an end-user, optionally interactive',
        arguments: [
            {
                name: 'timeout',
                type: 'Float',
                description: 'The maximum time allowed for the browser to remain alive. Once the time is reached, the end-user will receive a prompt that the session has closed',
                required: false
            },
            {
                name: 'interactable',
                type: 'Boolean',
                description: 'Whether the session is interactable or not. Set to "false" to not allow click and mouse events to be forwarded through to the end-user',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'type',
                type: 'LiveURLStreamType',
                description: 'The binary-type of the streamed image. "jpeg" will consume lower bandwidth and useful for low bandwidth networks and devices. "png" is a much higher quality but will consume considerably more bandwidth. Use "jpeg" when setting a custom quality',
                required: false,
                defaultValue: 'jpeg'
            },
            {
                name: 'quality',
                type: 'Int',
                description: 'The quality of the stream, represented as number from 1 - 100. Only used when "type" is "jpeg"',
                required: false,
                defaultValue: '100'
            },
            {
                name: 'resizable',
                type: 'Boolean',
                description: 'Whether or not to resize the underlying browser to match the end-user\'s screen size. When `false` the underlying browser will retain its current viewport, and the end user\'s screen will maintain the appropriate aspect ratio',
                required: false,
                defaultValue: 'true'
            }
        ],
        returns: [
            {
                name: 'liveURL',
                type: 'String',
                description: 'The fully-qualified live streaming URL for the browser session'
            }
        ],
        example: `mutation LiveURLExamples {
  # Navigate to page first
  goto(url: "https://example.com") {
    status
  }

  # Basic live URL (interactive, resizable, high quality)
  basicStream: liveURL {
    liveURL
  }

  # Non-interactive stream (view-only)
  viewOnly: liveURL(interactable: false) {
    liveURL
  }

  # Fixed viewport (non-resizable)
  fixedViewport: liveURL(resizable: false) {
    liveURL
  }

  # Low quality for better bandwidth
  lowQuality: liveURL(quality: 20, type: jpeg) {
    liveURL
  }

  # High quality PNG stream
  highQuality: liveURL(type: png) {
    liveURL
  }

  # Timed session (30 second timeout)
  timedSession: liveURL(timeout: 30000, interactable: true) {
    liveURL
  }

  # Complete configuration
  customStream: liveURL(
    timeout: 60000
    interactable: true
    type: jpeg
    quality: 80
    resizable: false
  ) {
    liveURL
  }
}`
    },
    {
        name: 'mapSelector',
        description: 'Specify a selector that returns multiple nodes in a document (similar to `document.querySelectorAll`), or JavaScript that returns a NodeList, and this API will respond with details about those DOM nodes. Similar to how "map" works in most functional programming languages and libraries. Useful for mapping over repetitive data in sites and pages like product listings or search results. This will automatically wait for the selector to be present on the page, and is configurable with the "wait" and "timeout" options. This API will always return a list of results back regardless if one or more items are found, or `null` if none are found.',
        arguments: [
            {
                name: 'selector',
                type: 'String!',
                description: 'A `document.querySelectorAll` compatible string, or JavaScript that returns a DOM NodeList. Examples include: A list of `<button />` Elements: `selector: "button"`, or a JavaScript snippet that returns a button element: `selector: "document.querySelectorAll(\'button\')"`',
                required: true
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'How long to wait for the element to appear before timing out, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'wait',
                type: 'Boolean',
                description: 'Whether or not to wait for the selectors to present in the DOM',
                required: false,
                defaultValue: 'true'
            }
        ],
        returns: [
            {
                name: 'innerHTML',
                type: 'String',
                description: 'The inner HTML content of the element'
            },
            {
                name: 'innerText',
                type: 'String',
                description: 'The inner text content of the element'
            },
            {
                name: 'outerHTML',
                type: 'String',
                description: 'The outer HTML content including the element itself'
            },
            {
                name: 'tagName',
                type: 'String',
                description: 'The tag name of the element'
            },
            {
                name: 'attributes',
                type: '[Attribute]',
                description: 'Array of element attributes with name and value pairs'
            },
            {
                name: 'mapSelector',
                type: '[MapSelectorResponse]',
                description: 'Nested mapSelector calls for hierarchical data extraction'
            }
        ],
        example: `mutation DataExtraction {
  goto(url: "https://news.ycombinator.com") {
    status
  }

  # Simple mapping - get all story elements
  stories: mapSelector(selector: ".athing") {
    innerHTML
    innerText
    tagName
  }

  # Advanced nested mapping with aliases
  posts: mapSelector(selector: ".athing") {
    postName: innerText
    
    # Get nested authors
    authors: mapSelector(selector: ".hnuser") {
      authorName: innerText
    }
    
    # Get nested scores  
    scores: mapSelector(selector: ".score") {
      scoreValue: innerText
    }
    
    # Get custom attributes
    attributes {
      name
      value
    }
  }

  # Product listing example
  products: mapSelector(selector: ".product-item") {
    productTitle: innerText
    productHTML: innerHTML
    
    # Get nested price information
    pricing: mapSelector(selector: ".price") {
      priceText: innerText
    }
    
    # Get nested images
    images: mapSelector(selector: "img") {
      attributes {
        name
        value
      }
    }
  }

  # Search results mapping
  searchResults: mapSelector(selector: ".search-result", timeout: 10000) {
    title: innerText
    fullHTML: outerHTML
    
    # Get nested links
    links: mapSelector(selector: "a") {
      linkText: innerText
      attributes {
        name
        value
      }
    }
  }
}`
    },
    {
        name: 'pdf',
        description: 'Generates a PDF of the page with the print CSS media type',
        arguments: [
            {
                name: 'displayHeaderFooter',
                type: 'Boolean',
                description: 'Display header and footer. Defaults to false',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'format',
                type: 'PDFPageFormat',
                description: 'The page format to use for the PDF',
                required: false
            },
            {
                name: 'footerTemplate',
                type: 'String',
                description: 'HTML template for the print footer. Should use the same format as the `headerTemplate`',
                required: false
            },
            {
                name: 'generateDocumentOutline',
                type: 'Boolean',
                description: 'Whether or not to embed the document outline into the PDF',
                required: false
            },
            {
                name: 'generateTaggedPDF',
                type: 'Boolean',
                description: 'Whether or not to generate tagged (accessible) PDF. Defaults to embedded choice',
                required: false
            },
            {
                name: 'landscape',
                type: 'Boolean',
                description: 'Paper orientation. Defaults to false',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'printBackground',
                type: 'Boolean',
                description: 'Print background graphics. Defaults to false',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'scale',
                type: 'Float',
                description: 'Scale of the webpage rendering. Defaults to 1',
                required: false,
                defaultValue: '1'
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'The maximum amount of time, in milliseconds, to wait for the PDF to be generated. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'width',
                type: 'FloatOrString',
                description: 'Width in inches or CSS unit. Defaults to 8.5 inches',
                required: false,
                defaultValue: '8.5'
            },
            {
                name: 'headerTemplate',
                type: 'String',
                description: 'HTML template for the print header. Should be valid HTML markup with following classes used to inject printing values into them: `date` (formatted print date), `title` (document title), `url` (document location), `pageNumber` (current page number), `totalPages` (total pages in the document). For example, `<span class=title></span>` would generate span containing the title',
                required: false
            },
            {
                name: 'height',
                type: 'FloatOrString',
                description: 'Height in inches or CSS unit. Defaults to 11 inches',
                required: false,
                defaultValue: '11'
            },
            {
                name: 'marginBottom',
                type: 'FloatOrString',
                description: 'Bottom margin in inches or CSS unit. Defaults to 1cm (~0.4 inches)',
                required: false,
                defaultValue: '1cm'
            },
            {
                name: 'marginLeft',
                type: 'FloatOrString',
                description: 'Left margin in inches or CSS unit. Defaults to 1cm (~0.4 inches)',
                required: false,
                defaultValue: '1cm'
            },
            {
                name: 'marginRight',
                type: 'FloatOrString',
                description: 'Right margin in inches or CSS unit. Defaults to 1cm (~0.4 inches)',
                required: false,
                defaultValue: '1cm'
            },
            {
                name: 'marginTop',
                type: 'FloatOrString',
                description: 'Top margin in inches or CSS unit. Defaults to 1cm (~0.4 inches)',
                required: false,
                defaultValue: '1cm'
            },
            {
                name: 'pageRanges',
                type: 'String',
                description: 'Paper ranges to print, one based, e.g., \'1-5, 8, 11-13\'. Pages are printed in the document order, not in the order specified, and no more than once. Defaults to empty string, which implies the entire document is printed. The page numbers are quietly capped to actual page count of the document, and ranges beyond the end of the document are ignored. If this results in no pages to print, an error is reported. It is an error to specify a range with start greater than end',
                required: false
            },
            {
                name: 'preferCSSPageSize',
                type: 'Boolean',
                description: 'Whether or not to prefer page size as defined by css. Defaults to false, in which case the content will be scaled to fit the paper size',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'transferMode',
                type: 'String',
                description: 'Return as stream (PrintToPDFRequestTransferMode enum)',
                required: false
            }
        ],
        returns: [
            {
                name: 'base64',
                type: 'String',
                description: 'Base64 encoded PDF data'
            }
        ],
        example: `mutation PDFGeneration {
  goto(url: "https://example.com", waitUntil: firstMeaningfulPaint) {
    status
  }

  # Simple PDF generation
  simple: pdf {
    base64
  }

  # PDF with custom format and headers
  customFormat: pdf(
    format: a4
    displayHeaderFooter: true
    headerTemplate: "<span style='font-size: 16pt;'>Example Document</span>"
    footerTemplate: "<span style='font-size: 12pt;'>Page <span class='pageNumber'></span> of <span class='totalPages'></span></span>"
  ) {
    base64
  }

  # Portrait PDF with custom margins
  portrait: pdf(
    landscape: false
    marginTop: "2cm"
    marginBottom: "2cm"
    marginLeft: "1.5cm"
    marginRight: "1.5cm"
    printBackground: true
  ) {
    base64
  }

  # Landscape PDF with custom size
  landscape: pdf(
    landscape: true
    width: "11in"
    height: "8.5in"
    scale: 0.8
    preferCSSPageSize: true
  ) {
    base64
  }

  # PDF with page ranges and accessibility
  accessiblePDF: pdf(
    generateTaggedPDF: true
    generateDocumentOutline: true
    pageRanges: "1-3, 5"
    timeout: 45000
  ) {
    base64
  }

  # PDF with advanced header template
  advancedPDF: pdf(
    format: a4
    displayHeaderFooter: true
    headerTemplate: \`
      <div style="font-size: 12pt; width: 100%; text-align: center; margin: 0 1cm;">
        <span class="title"></span> | <span class="date"></span>
      </div>
    \`
    footerTemplate: \`
      <div style="font-size: 10pt; width: 100%; text-align: center; margin: 0 1cm;">
        <span class="url"></span> | Page <span class="pageNumber"></span>/<span class="totalPages"></span>
      </div>
    \`
    printBackground: true
    scale: 1.0
  ) {
    base64
  }
}`
    },
    {
        name: 'preferences',
        description: 'Sets configuration for the entirety of the session, replacing defaults like the 30 second timeout default',
        arguments: [
            {
                name: 'timeout',
                type: 'Float',
                description: 'Sets a default timeout for all methods, including \'goto\', \'type\', \'wait\', etc. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            }
        ],
        returns: [
            {
                name: 'timeout',
                type: 'Float',
                description: 'The configured default timeout value in milliseconds'
            }
        ],
        example: `mutation SessionPreferences {
  # Set default timeout for all operations to 10 seconds
  fastSession: preferences(timeout: 10000) {
    timeout
  }

  # Navigate with the new default timeout
  goto(url: "https://example.com") {
    status
    time
  }

  # All subsequent operations will use the 10-second default
  click(selector: "button") {
    selector
    time
  }

  # Override default for specific operation if needed
  slowOperation: click(selector: ".slow-button", timeout: 60000) {
    selector
    time
  }
}

mutation SlowSessionConfiguration {
  # Set longer default timeout for complex operations
  slowSession: preferences(timeout: 60000) {
    timeout
  }

  # Navigate to complex SPA
  goto(url: "https://complex-app.example.com") {
    status
    time
  }

  # Wait for heavy JavaScript application to load
  waitForSelector(selector: ".app-ready") {
    success
  }

  # All operations now use 60-second default
  type(selector: "#search", text: "complex query") {
    text
    time
  }
}

mutation AdaptiveTimeoutWorkflow {
  # Start with fast defaults for simple operations
  quickSetup: preferences(timeout: 5000) {
    timeout
  }

  # Quick navigation
  goto(url: "https://fast-site.example.com") {
    status
  }

  # Simple interactions
  fillForm: type(selector: "#username", text: "user123") {
    text
  }

  # Switch to slower defaults for complex operations
  slowSetup: preferences(timeout: 45000) {
    timeout
  }

  # Complex navigation with heavy assets
  complexPage: goto(url: "https://media-heavy.example.com") {
    status
    time
  }

  # Wait for dynamic content
  waitForContent: waitForSelector(selector: ".dynamic-content") {
    success
  }
}`
    },
    {
        name: 'proxy',
        description: 'Proxies requests, by a specified set of conditions, through either the Browserless residential proxy or through an external proxy. Only requests that match these conditions are proxied and the rest are sent from the instance\'s own IP address',
        arguments: [
            {
                name: 'country',
                type: 'CountryType',
                description: 'The country you wish to proxy through. Only allowed when using the browserless.io proxy and no `server` argument',
                required: false
            },
            {
                name: 'city',
                type: 'String',
                description: 'The city you wish to proxy through. Any spaces should be removed and all casing lowercase. For instance, "New York City" should be "newyorkcity"',
                required: false
            },
            {
                name: 'state',
                type: 'String',
                description: 'The state or provence you wish to proxy through. Any spaces should be removed and all casing lowercase. For instance, "Rhode Island" would be "rhodeisland" and "New Brunswick" would be "newbrunswick"',
                required: false
            },
            {
                name: 'sticky',
                type: 'Boolean',
                description: 'Whether or not you want the same IP to be used for subsequent requests matching the pattern',
                required: false
            },
            {
                name: 'server',
                type: 'String',
                description: 'An external proxy to use for these requests matching the specified patterns set in the other arguments. When this is set then `country`, `city`, `state` and `sticky` options will throw errors as these are only valid for the browserless.io proxy network',
                required: false
            },
            {
                name: 'method',
                type: '[Method]',
                description: 'The Method(s) of the request you\'d like to proxy',
                required: false
            },
            {
                name: 'operator',
                type: 'OperatorTypes',
                description: 'Whether to "or" conditions together, meaning any condition that matches will be proxied, or "and" them together meaning every condition must match to proxy the request',
                required: false,
                defaultValue: 'or'
            },
            {
                name: 'type',
                type: '[ResourceType]',
                description: 'The content-type of the request you\'d like to proxy requests to',
                required: false
            },
            {
                name: 'url',
                type: '[String]',
                description: 'A glob-style URL pattern to match requests, and if matched, are proxied through',
                required: false
            }
        ],
        returns: [
            {
                name: 'time',
                type: 'Float',
                description: 'Time elapsed in milliseconds for setting up the proxy configuration'
            }
        ],
        example: `mutation ProxyConfiguration {
  # Use Browserless residential proxy for all requests through Brazil
  brazilProxy: proxy(
    url: ["*"]
    country: BR
  ) {
    time
  }

  # Navigate using the Brazil proxy
  goto(url: "https://example.com") {
    status
    url
  }

  # Use external proxy for all requests
  externalProxy: proxy(
    url: ["*"]
    server: "http://username:password@my-proxy.com:12321"
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

  # Advanced proxy configuration with multiple conditions
  advancedProxy: proxy(
    url: ["https://api.example.com/*", "https://cdn.example.com/*"]
    method: [GET, POST]
    type: [xhr, fetch]
    country: US
    state: "california"
    city: "losangeles"
    sticky: true
    operator: and
  ) {
    time
  }

  # Proxy specific API endpoints through external proxy
  apiProxy: proxy(
    url: ["https://secure-api.example.com/*"]
    method: [POST, PUT, DELETE]
    server: "https://secure-user:secure-pass@enterprise-proxy.com:8080"
    operator: and
  ) {
    time
  }
}`
    },
    {
        name: 'querySelectorAll',
        description: 'Passes through certain properties of the browsers\' own `document.querySelectorAll` API',
        arguments: [
            {
                name: 'selector',
                type: 'String!',
                description: 'CSS selector string to query multiple elements',
                required: true
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'Maximum wait time in milliseconds for elements to appear',
                required: false
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Only return visible elements',
                required: false,
                defaultValue: 'false'
            }
        ],
        returns: [
            {
                name: 'innerHTML',
                type: 'String',
                description: 'Inner HTML content of the element'
            },
            {
                name: 'innerText',
                type: 'String',
                description: 'Text content of the element'
            },
            {
                name: 'outerHTML',
                type: 'String',
                description: 'Outer HTML including the element tags'
            },
            {
                name: 'tagName',
                type: 'String',
                description: 'HTML tag name of the element'
            },
            {
                name: 'attributes',
                type: '[Attribute]',
                description: 'Array of element attributes with name and value pairs'
            }
        ],
        example: `mutation QuerySelectorAllExamples {
  goto(url: "https://example.com") {
    status
  }

  # Basic querySelectorAll - get all h1 elements
  headlines: querySelectorAll(selector: "h1") {
    innerHTML
    innerText
    tagName
  }

  # Get all links with attributes
  links: querySelectorAll(selector: "a") {
    innerHTML
    innerText
    outerHTML
    attributes {
      name
      value
    }
  }

  # Get only visible images
  visibleImages: querySelectorAll(
    selector: "img"
    visible: true
  ) {
    outerHTML
    attributes {
      name
      value
    }
  }

  # Get form inputs with timeout
  formInputs: querySelectorAll(
    selector: "input, textarea, select"
    timeout: 5000
    visible: true
  ) {
    tagName
    attributes {
      name
      value
    }
  }

  # Get all buttons
  buttons: querySelectorAll(selector: "button, input[type='button'], input[type='submit']") {
    innerHTML
    innerText
    tagName
    attributes {
      name
      value
    }
  }

  # Get table cells
  tableCells: querySelectorAll(selector: "td, th") {
    innerText
    innerHTML
    tagName
  }

  # Get navigation elements
  navigation: querySelectorAll(selector: "nav a, .nav a, [role='navigation'] a") {
    innerText
    attributes {
      name
      value
    }
  }

  # Get all elements with specific classes
  highlightedElements: querySelectorAll(selector: ".highlight, .featured, .important") {
    innerHTML
    innerText
    tagName
    outerHTML
  }

  # Get data attributes
  dataElements: querySelectorAll(selector: "[data-id], [data-value], [data-type]") {
    tagName
    attributes {
      name
      value
    }
  }

  # Get all headings
  headings: querySelectorAll(selector: "h1, h2, h3, h4, h5, h6") {
    innerText
    tagName
    outerHTML
  }
}`
    },
    {
        name: 'querySelector',
        description: 'Passes through certain properties of the browsers\' own `document.querySelector` API',
        arguments: [
            {
                name: 'selector',
                type: 'String!',
                description: 'CSS selector string to query a single element',
                required: true
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'Maximum wait time in milliseconds for element to appear',
                required: false
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Only return element if it is visible',
                required: false,
                defaultValue: 'false'
            }
        ],
        returns: [
            {
                name: 'innerHTML',
                type: 'String',
                description: 'Inner HTML content of the element'
            },
            {
                name: 'innerText',
                type: 'String',
                description: 'Text content of the element'
            },
            {
                name: 'outerHTML',
                type: 'String',
                description: 'Outer HTML including the element tags'
            },
            {
                name: 'tagName',
                type: 'String',
                description: 'HTML tag name of the element'
            },
            {
                name: 'attributes',
                type: '[Attribute]',
                description: 'Array of element attributes with name and value pairs'
            }
        ],
        example: `mutation QuerySelectorExamples {
  goto(url: "https://example.com") {
    status
  }

  # Basic querySelector - get first h1 element
  mainHeadline: querySelector(selector: "h1") {
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

  # Get visible button with timeout
  actionButton: querySelector(
    selector: "button.primary"
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

  # Get form element
  loginForm: querySelector(selector: "form#login") {
    tagName
    outerHTML
    attributes {
      name
      value
    }
  }

  # Get navigation element
  mainNav: querySelector(selector: "nav.primary, nav[role='navigation']") {
    innerHTML
    tagName
    attributes {
      name
      value
    }
  }

  # Get first image
  heroImage: querySelector(selector: "img.hero, .hero img") {
    tagName
    attributes {
      name
      value
    }
  }

  # Get specific data element
  dataElement: querySelector(selector: "[data-id='main-content']") {
    innerHTML
    innerText
    tagName
    attributes {
      name
      value
    }
  }

  # Get first table
  dataTable: querySelector(selector: "table") {
    tagName
    innerHTML
  }

  # Get main content area
  mainContent: querySelector(selector: "main, #main, .main-content") {
    tagName
    innerHTML
  }

  # Get footer element
  pageFooter: querySelector(selector: "footer") {
    innerHTML
    tagName
    attributes {
      name
      value
    }
  }
}`
    },
    {
        name: 'reconnect',
        description: 'Returns a payload with reconnection information in order to reconnect back to the same browser session',
        arguments: [
            {
                name: 'timeout',
                type: 'Float',
                description: 'The amount of time, in milliseconds, to leave the browser open without a connection before it is manually terminated. Defaults to 30 seconds',
                required: false,
                defaultValue: '30000'
            }
        ],
        returns: [
            {
                name: 'browserQLEndpoint',
                type: 'String',
                description: 'BrowserQL GraphQL endpoint URL for reconnection'
            },
            {
                name: 'browserWSEndpoint', 
                type: 'String',
                description: 'WebSocket endpoint URL for real-time browser connection'
            },
            {
                name: 'devtoolsFrontendUrl',
                type: 'String',
                description: 'Chrome DevTools frontend URL for debugging'
            },
            {
                name: 'webSocketDebuggerUrl',
                type: 'String',
                description: 'WebSocket debugger URL for Chrome DevTools protocol'
            }
        ],
        example: `mutation ReconnectExamples {
  # Navigate to page first
  goto(url: "https://example.com") {
    status
    url
  }

  # Basic reconnect with default timeout (30 seconds)
  basicReconnect: reconnect {
    browserQLEndpoint
    browserWSEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }

  # Reconnect with custom timeout (60 seconds)
  extendedReconnect: reconnect(timeout: 60000) {
    browserQLEndpoint
    browserWSEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }

  # Reconnect for long-running sessions (5 minutes)
  longSessionReconnect: reconnect(timeout: 300000) {
    browserQLEndpoint
    browserWSEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }

  # Quick reconnect for fast operations (10 seconds)
  quickReconnect: reconnect(timeout: 10000) {
    browserQLEndpoint
    browserWSEndpoint
  }

  # Development workflow reconnect
  devReconnect: reconnect(timeout: 120000) {
    browserQLEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }

  # Production reconnect with monitoring
  prodReconnect: reconnect(timeout: 45000) {
    browserQLEndpoint
    browserWSEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }

  # Session persistence for automation
  automationReconnect: reconnect(timeout: 180000) {
    browserQLEndpoint
    browserWSEndpoint
  }

  # Debugging session reconnect
  debugReconnect: reconnect(timeout: 600000) {
    browserQLEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }

  # Load testing reconnect
  loadTestReconnect: reconnect(timeout: 90000) {
    browserQLEndpoint
    browserWSEndpoint
    devtoolsFrontendUrl
    webSocketDebuggerUrl
  }

  # Minimal reconnect for basic session management
  minimalReconnect: reconnect(timeout: 15000) {
    browserQLEndpoint
  }
}`
    },
    {
        name: 'reject',
        description: 'Rejects requests by a specified URL pattern, method, or type and operator. You may supply a single pattern, or a list (array) of them. This mutation, by default, will reject any requests that match _any_ pattern, which we call an "or" operator. To reject requests where conditions must all match, specify an "and" operator in the mutation. Note that this only has an effect when the query is executing, so scripts that return quickly will likely see assets loading in the editor as these rejections only happen when mutations are executing.',
        arguments: [
            {
                name: 'enabled',
                type: 'Boolean',
                description: 'Whether or not to enable request rejections',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'method',
                type: '[Method]',
                description: 'The Method of the request you\'d like to reject',
                required: false
            },
            {
                name: 'operator',
                type: 'OperatorTypes',
                description: 'Whether to "or" conditions together, meaning any condition that matches will be rejected, or "and" them together meaning every condition must match to reject the request.',
                required: false,
                defaultValue: 'or'
            },
            {
                name: 'type',
                type: '[ResourceType]',
                description: 'The type of resource you\'d like to reject request to',
                required: false
            },
            {
                name: 'url',
                type: '[String]',
                description: 'The glob-style URL pattern you\'d like to reject requests to',
                required: false
            }
        ],
        returns: [
            {
                name: 'enabled',
                type: 'Boolean',
                description: 'Whether request rejection is enabled'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'Time elapsed in milliseconds for the reject operation'
            }
        ],
        example: `mutation RejectExamples {
  # Reject all images and media files
  rejectMedia: reject(type: [image, media]) {
    enabled
    time
  }

  # Reject images from Google domains (AND condition)
  rejectGoogleImages: reject(
    operator: and
    type: [image]
    url: ["*google.com*"]
  ) {
    enabled
    time
  }

  # Reject POST and PUT requests to API endpoints
  rejectAPIWrites: reject(
    method: [POST, PUT]
    url: ["*/api/*", "*/v1/*", "*/graphql*"]
    operator: or
  ) {
    enabled
    time
  }

  # Reject all JavaScript and stylesheets
  rejectAssets: reject(
    type: [script, stylesheet]
    operator: or
  ) {
    enabled
    time
  }

  # Reject tracking and analytics scripts
  rejectTracking: reject(
    url: [
      "*google-analytics.com*",
      "*googletagmanager.com*",
      "*facebook.com/tr*",
      "*doubleclick.net*",
      "*ads*"
    ]
    operator: or
  ) {
    enabled
    time
  }

  # Reject requests to specific domains with specific methods
  rejectSpecificDomains: reject(
    url: ["*example-ads.com*", "*tracking-service.net*"]
    method: [GET, POST]
    operator: and
  ) {
    enabled
    time
  }

  # Reject all media types from CDNs
  rejectCDNMedia: reject(
    type: [image, media, font]
    url: ["*cdn*", "*assets*"]
    operator: and
  ) {
    enabled
    time
  }

  # Reject XHR and Fetch requests to external APIs
  rejectExternalAPIs: reject(
    type: [xhr, fetch]
    url: ["https://*", "http://*"]
    operator: and
  ) {
    enabled
    time
  }

  # Navigate after setting up rejections
  goto(url: "https://cnn.com", waitUntil: firstMeaningfulPaint) {
    status
    time
    url
  }

  # Disable request rejections
  disableReject: reject(enabled: false) {
    enabled
    time
  }

  # Re-enable with different patterns
  enableCustomReject: reject(
    enabled: true
    type: [websocket, eventsource]
    url: ["*realtime*", "*socket*"]
  ) {
    enabled
    time
  }

  # Performance optimization - reject heavy resources
  performanceReject: reject(
    type: [image, media, font]
    url: ["*.jpg", "*.png", "*.mp4", "*.woff*"]
    operator: or
  ) {
    enabled
    time
  }

  # Security-focused rejections
  securityReject: reject(
    url: [
      "*malware*",
      "*phishing*",
      "*suspicious*",
      "*.exe",
      "*.bat"
    ]
    operator: or
  ) {
    enabled
    time
  }

  # Bandwidth optimization
  bandwidthReject: reject(
    type: [image, media]
    method: [GET]
    operator: and
  ) {
    enabled
    time
  }
}`
    },
    {
        name: 'reload',
        description: 'Reloads the given page with an optional waitUntil parameter and timeout parameter',
        arguments: [
            {
                name: 'timeout',
                type: 'Float',
                description: 'The maximum amount of time, in milliseconds, to wait for the page to load, overriding any defaults. Default timeout is 30 seconds, or 30000.',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'waitUntil',
                type: 'WaitUntilHistory',
                description: 'When to consider the page fully-loaded and proceed with further execution',
                required: false,
                defaultValue: 'load'
            }
        ],
        returns: [
            {
                name: 'status',
                type: 'Int',
                description: 'HTTP status code of the reloaded page'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'Time taken for the reload operation in milliseconds'
            },
            {
                name: 'text',
                type: 'String',
                description: 'Text content of the reloaded page'
            },
            {
                name: 'url',
                type: 'String',
                description: 'Final URL after reload (may differ due to redirects)'
            }
        ],
        example: `mutation ReloadExamples {
  # Initial navigation
  goto(url: "https://example.com") {
    status
    url
  }

  # Basic reload with default settings (30 seconds, load event)
  basicReload: reload {
    status
    time
    url
  }

  # Reload with custom timeout
  timeoutReload: reload(timeout: 10000) {
    status
    time
    url
  }

  # Reload waiting for DOM content loaded
  domReload: reload(waitUntil: domContentLoaded) {
    status
    time
    text
    url
  }

  # Fast reload for quick refresh
  quickReload: reload(
    timeout: 5000
    waitUntil: commit
  ) {
    status
    time
    url
  }

  # Complete reload with full content
  fullReload: reload(
    timeout: 45000
    waitUntil: load
  ) {
    status
    time
    text
    url
  }

  # Network idle reload for dynamic content
  networkReload: reload(
    timeout: 20000
    waitUntil: networkIdle
  ) {
    status
    time
    text
    url
  }

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

  # Testing reload for automation
  testReload: reload(
    timeout: 8000
    waitUntil: commit
  ) {
    status
    time
    url
  }

  # Performance reload for speed testing
  perfReload: reload(
    timeout: 3000
    waitUntil: commit
  ) {
    status
    time
    url
  }

  # Monitoring reload for health checks
  monitorReload: reload(
    timeout: 12000
    waitUntil: load
  ) {
    status
    time
    url
  }

  # Debug reload with full content and extended timeout
  debugReload: reload(
    timeout: 90000
    waitUntil: load
  ) {
    status
    time
    text
    url
  }
}`
    },
    {
        name: 'request',
        description: 'Returns request information made by the Browser with optional filters via arguments. You may filter the returned results by a glob-like URL-pattern, the method of the request or the type of request. Applying an operator to this will then change the behavior by either "and"ing the filters together or "or"ing them. This API will automatically wait for the request to be made if none is immediately found which you can turn off by disabling the "wait" option.',
        arguments: [
            {
                name: 'type',
                type: '[ResourceType]',
                description: 'The type content-type of the request to match against',
                required: false
            },
            {
                name: 'method',
                type: '[Method]',
                description: 'The method of the request to return results for',
                required: false
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'How long to wait for the request(s) to be made before timing out, overriding any defaults. Default timeout is 30 seconds, or 30000. "wait" parameter must also be "true".',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'url',
                type: '[String]',
                description: 'The pattern of the request URL to wait for, using glob-style pattern-matching',
                required: false
            },
            {
                name: 'wait',
                type: 'Boolean',
                description: 'Whether or not to wait for the request to be made. When set to `true`, generally only one request is returned since this API will wait for the first request that matches any patterns to be returned',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'operator',
                type: 'OperatorTypes',
                description: 'When applying arguments like URL or method, this operator will either "and" them together, or "or" them together. Default is "or"',
                required: false,
                defaultValue: 'or'
            }
        ],
        returns: [
            {
                name: 'url',
                type: 'String',
                description: 'The URL of the request'
            },
            {
                name: 'type',
                type: 'ResourceType',
                description: 'The resource type of the request'
            },
            {
                name: 'method',
                type: 'Method',
                description: 'The HTTP method of the request'
            },
            {
                name: 'headers',
                type: '[Header]',
                description: 'Array of request headers with name and value pairs'
            }
        ],
        example: `mutation RequestExamples {
  # Navigate to trigger requests
  goto(url: "https://example.com/", waitUntil: load) {
    status
  }

  # Get all document requests
  documentRequests: request(type: [document]) {
    url
    type
    method
    headers {
      name
      value
    }
  }

  # Get all AJAX GET requests (AND condition)
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

  # Monitor API requests
  apiRequests: request(
    url: ["*/api/*", "*/v1/*", "*/graphql*"]
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

  # Track image requests
  imageRequests: request(type: [image]) {
    url
    type
    method
  }

  # Monitor script loading
  scriptRequests: request(
    type: [script]
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

  # Track CSS requests
  stylesheetRequests: request(type: [stylesheet]) {
    url
    type
    method
  }

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

  # Track external API calls
  externalAPIs: request(
    type: [xhr, fetch]
    url: ["https://*", "http://*"]
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

  # Monitor third-party requests
  thirdPartyRequests: request(
    url: [
      "*google-analytics*",
      "*facebook*",
      "*twitter*",
      "*linkedin*"
    ]
    operator: or
  ) {
    url
    type
    method
  }

  # Track font requests
  fontRequests: request(type: [font]) {
    url
    type
    method
  }

  # Monitor WebSocket connections
  websocketRequests: request(type: [websocket]) {
    url
    type
    method
    headers {
      name
      value
    }
  }

  # Track media requests
  mediaRequests: request(type: [media]) {
    url
    type
    method
  }

  # Monitor specific endpoints
  specificEndpoints: request(
    url: ["*/login*", "*/auth*", "*/token*"]
    method: [POST, PUT]
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

  # Track CDN requests
  cdnRequests: request(
    url: ["*cdn*", "*assets*", "*static*"]
    operator: or
  ) {
    url
    type
    method
  }

  # Monitor without waiting (get existing requests)
  existingRequests: request(
    wait: false
    timeout: 1000
  ) {
    url
    type
    method
  }
}`
    },
    {
        name: 'response',
        description: 'Returns response information, filtered by the provided arguments, made by the browser. You may optionally filter the returned results by a glob-like URL-pattern, the Method of the response or the Type of response. Applying an operator to this will then change the behavior by either "and"ing the filters together, or "or"ing them. This API will automatically wait for the response to be made if none is immediately found which you can turn off by disabling the "wait" option.',
        arguments: [
            {
                name: 'status',
                type: '[Int]',
                description: 'The status codes response to return results for',
                required: false
            },
            {
                name: 'method',
                type: '[Method]',
                description: 'The method of the response to return results for',
                required: false
            },
            {
                name: 'operator',
                type: 'OperatorTypes',
                description: 'When applying arguments like URL or method, this operator will either "and" them together, or "or" them together. Default is "or"',
                required: false,
                defaultValue: 'or'
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'How long to wait for the response(s) to be made before timing out, overriding any defaults. Default timeout is 30 seconds, or 30000. "wait" parameter must also be "true".',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'type',
                type: '[ResourceType]',
                description: 'The type content-type of the response to match against',
                required: false
            },
            {
                name: 'url',
                type: '[String]',
                description: 'The pattern of the response URL to wait for, using glob-style pattern-matching',
                required: false
            },
            {
                name: 'wait',
                type: 'Boolean',
                description: 'Whether or not to wait for the response to be received. When set to `true`, generally only one response is returned since this API will wait for the first response that matches any patterns to be returned',
                required: false,
                defaultValue: 'true'
            }
        ],
        returns: [
            {
                name: 'url',
                type: 'String',
                description: 'The URL of the response'
            },
            {
                name: 'type',
                type: 'ResourceType',
                description: 'The resource type of the response'
            },
            {
                name: 'method',
                type: 'Method',
                description: 'The HTTP method of the response'
            },
            {
                name: 'status',
                type: 'Int',
                description: 'The HTTP status code of the response'
            },
            {
                name: 'body',
                type: 'String',
                description: 'The response body content'
            },
            {
                name: 'headers',
                type: '[Header]',
                description: 'Array of response headers with name and value pairs'
            }
        ],
        example: `mutation ResponseExamples {
  # Navigate to trigger responses
  goto(url: "https://example.com/", waitUntil: load) {
    status
  }

  # Get all document responses
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

  # Get all successful GET responses (AND condition)
  successfulGets: response(
    method: [GET]
    status: [200, 201, 204]
    operator: and
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

  # Monitor API responses
  apiResponses: response(
    url: ["*/api/*", "*/v1/*", "*/graphql*"]
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

  # Track AJAX responses
  ajaxResponses: response(
    type: [xhr, fetch]
    method: [GET, POST]
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

  # Monitor error responses
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

  # Track specific endpoint responses
  authResponses: response(
    url: ["*/login*", "*/auth*", "*/token*"]
    method: [POST]
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

  # Monitor CSS responses
  stylesheetResponses: response(type: [stylesheet]) {
    url
    type
    method
    status
  }

  # Track image responses
  imageResponses: response(type: [image]) {
    url
    type
    method
    status
  }

  # Monitor script responses
  scriptResponses: response(
    type: [script]
    status: [200]
    operator: and
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

  # Track external API responses
  externalAPIs: response(
    url: ["https://*", "http://*"]
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

  # Monitor third-party responses
  thirdPartyResponses: response(
    url: [
      "*google-analytics*",
      "*facebook*",
      "*twitter*",
      "*cdn*"
    ]
    operator: or
  ) {
    url
    type
    method
    status
  }

  # Track redirect responses
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

  # Monitor without waiting (get existing responses)
  existingResponses: response(
    wait: false
    timeout: 1000
  ) {
    url
    type
    method
    status
  }
}`
    },
    {
        name: 'screenshot',
        description: 'Screenshots the page or a specific selector. Supports various capture modes including full page, element-specific, clipped regions, and different image formats with quality control and performance optimization options.',
        arguments: [
            {
                name: 'captureBeyondViewport',
                type: 'Boolean',
                description: 'Capture the screenshot beyond the viewport. Default: False if there is no clip. True otherwise',
                required: false
            },
            {
                name: 'clip',
                type: 'ScreenshotClip',
                description: 'Specifies the region of the page/element to clip',
                required: false
            },
            {
                name: 'fromSurface',
                type: 'Boolean',
                description: 'Capture the screenshot from the surface, rather than the view. Default: True',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'fullPage',
                type: 'Boolean',
                description: 'When True, takes a screenshot of the full page. Default: False',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'omitBackground',
                type: 'Boolean',
                description: 'Hides default white background and allows capturing screenshots with transparency. Default: False',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'optimizeForSpeed',
                type: 'Boolean',
                description: 'Optimize image encoding for speed, not for resulting size. Default: False',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'quality',
                type: 'Float',
                description: 'Quality of the image, between 0-100. Not applicable to png images.',
                required: false
            },
            {
                name: 'selector',
                type: 'String',
                description: 'The CSS selector of the element on the page you want to screenshot',
                required: false
            },
            {
                name: 'type',
                type: 'ScreenshotType',
                description: 'The final format of the screenshot',
                required: false
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'The maximum amount of time, in milliseconds, to wait for the screenshot to be taken. Default timeout is 30 seconds, or 30000.',
                required: false,
                defaultValue: '30000'
            }
        ],
        returns: [
            {
                name: 'base64',
                type: 'String',
                description: 'Base64 encoded screenshot image data'
            }
        ],
        example: `mutation ScreenshotExamples {
  # Navigate to page
  goto(url: "https://example.com") {
    status
  }

  # Basic full page screenshot
  fullPageScreenshot: screenshot(fullPage: true) {
    base64
  }

  # Element-specific screenshot
  elementScreenshot: screenshot(selector: "header") {
    base64
  }

  # High quality JPEG screenshot
  highQualityScreenshot: screenshot(
    type: jpeg
    quality: 90
    fullPage: true
  ) {
    base64
  }

  # PNG screenshot with transparency
  transparentScreenshot: screenshot(
    type: png
    omitBackground: true
    selector: ".modal"
  ) {
    base64
  }

  # Optimized for speed
  fastScreenshot: screenshot(
    optimizeForSpeed: true
    type: jpeg
    quality: 60
  ) {
    base64
  }

  # Clipped region screenshot
  clippedScreenshot: screenshot(
    clip: {
      x: 100
      y: 100
      width: 500
      height: 300
    }
    type: png
  ) {
    base64
  }

  # Viewport screenshot (beyond viewport disabled)
  viewportScreenshot: screenshot(
    captureBeyondViewport: false
    fromSurface: false
  ) {
    base64
  }

  # Mobile element screenshot with timeout
  mobileScreenshot: screenshot(
    selector: ".mobile-menu"
    timeout: 10000
    type: png
  ) {
    base64
  }

  # Hero section capture
  heroScreenshot: screenshot(
    selector: ".hero-section"
    type: jpeg
    quality: 85
    timeout: 15000
  ) {
    base64
  }

  # Form screenshot with transparency
  formScreenshot: screenshot(
    selector: "form"
    type: png
    omitBackground: true
    timeout: 5000
  ) {
    base64
  }

  # Performance optimized capture
  perfScreenshot: screenshot(
    optimizeForSpeed: true
    captureBeyondViewport: false
    type: jpeg
    quality: 70
  ) {
    base64
  }

  # Article content screenshot
  contentScreenshot: screenshot(
    selector: "article, .content, main"
    fullPage: false
    type: png
    timeout: 20000
  ) {
    base64
  }
}`
    },
    {
        name: 'scroll',
        description: 'Waits for a selector, then scrolls to it on the page or an x,y coordinate in pixels. Provides precise scrolling control for element visibility, page navigation, and viewport positioning with wait conditions and timeout management.',
        arguments: [
            {
                name: 'selector',
                type: 'String',
                description: 'The DOM selector of the element on the page you want to scroll to',
                required: false
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'How long to wait for the element to appear before timing out, overriding any defaults. Default timeout is 30 seconds, or 30000.',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Whether or not to scroll to the element only if it\'s visible',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'wait',
                type: 'Boolean',
                description: 'Whether or not to wait for the element, then scroll to it',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'x',
                type: 'Float',
                description: 'The X coordinate, in pixels, to scroll to',
                required: false
            },
            {
                name: 'y',
                type: 'Float',
                description: 'The Y coordinate, in pixels, to scroll to',
                required: false
            }
        ],
        returns: [
            {
                name: 'time',
                type: 'Float',
                description: 'Time taken for the scroll operation in milliseconds'
            }
        ],
        example: `mutation ScrollExamples {
  # Navigate to page
  goto(url: "https://example.com") {
    status
  }

  # Basic element scroll
  scrollToHeader: scroll(selector: "header") {
    time
  }

  # Scroll to footer element
  scrollToFooter: scroll(selector: "footer") {
    time
  }

  # Coordinate-based scroll
  coordinateScroll: scroll(x: 500, y: 1000) {
    time
  }

  # Scroll to visible element only
  visibleElementScroll: scroll(
    selector: ".visible-content"
    visible: true
  ) {
    time
  }

  # Scroll with timeout
  timeoutScroll: scroll(
    selector: ".slow-loading-element"
    timeout: 10000
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

  # Navigation scroll
  navScroll: scroll(selector: "nav, .navigation") {
    time
  }

  # Content area scroll
  contentScroll: scroll(
    selector: "main, .content, article"
    visible: true
    timeout: 15000
  ) {
    time
  }

  # Form scroll
  formScroll: scroll(
    selector: "form"
    wait: true
    timeout: 8000
  ) {
    time
  }

  # Precise coordinate scroll
  preciseScroll: scroll(x: 250, y: 750) {
    time
  }

  # Mobile element scroll
  mobileScroll: scroll(
    selector: ".mobile-menu"
    visible: true
    timeout: 12000
  ) {
    time
  }

  # Bottom of page scroll
  bottomScroll: scroll(y: 9999) {
    time
  }

  # Top of page scroll
  topScroll: scroll(x: 0, y: 0) {
    time
  }
}`
    },
    {
        name: 'select',
        description: 'Selects a value from a dropdown or multiple select element. Supports both single and multiple option selection with scroll, visibility, and timeout controls for enhanced form automation and user interaction workflows.',
        arguments: [
            {
                name: 'timeout',
                type: 'Float',
                description: 'How long to wait for the element to appear before timing out on the handler, overriding any defaults. Default timeout is 30 seconds, or 30000.',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'scroll',
                type: 'Boolean',
                description: 'Whether or not to scroll to the select element prior to selecting, defaults to true',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'selector',
                type: 'String!',
                description: 'The CSS selector of the element on the page you want to select a value from',
                required: true
            },
            {
                name: 'value',
                type: 'StringOrArray!',
                description: 'The value or values to select from the dropdown or multiple select element',
                required: true
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Whether or not to select the element only if it\'s visible',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'wait',
                type: 'Boolean',
                description: 'Whether or not to wait for the select to present in the DOM',
                required: false,
                defaultValue: 'true'
            }
        ],
        returns: [
            {
                name: 'time',
                type: 'Float',
                description: 'Time taken for the select operation in milliseconds'
            }
        ],
        example: `mutation SelectExamples {
  # Navigate to page
  goto(url: "https://example.com") {
    status
  }

  # Single value selection
  countrySelect: select(
    selector: "select[name='country']"
    value: "US"
  ) {
    time
  }

  # Multiple value selection
  multiSelect: select(
    selector: "select[name='skills']"
    value: ["javascript", "typescript", "react"]
  ) {
    time
  }

  # Select with visibility check
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

  # Select without scrolling
  noScrollSelect: select(
    selector: "select.no-scroll"
    value: "option3"
    scroll: false
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

  # Form dropdown selection
  formSelect: select(
    selector: "form select[name='category']"
    value: "technology"
  ) {
    time
  }

  # Language selector
  languageSelect: select(
    selector: "select#language"
    value: "en"
    visible: true
    timeout: 10000
  ) {
    time
  }

  # Currency selector
  currencySelect: select(
    selector: "select[name='currency']"
    value: "USD"
    scroll: true
  ) {
    time
  }

  # Region selector with multiple options
  regionSelect: select(
    selector: "select[multiple][name='regions']"
    value: ["north-america", "europe", "asia"]
  ) {
    time
  }

  # Priority selector
  prioritySelect: select(
    selector: "select.priority"
    value: "high"
    visible: true
    wait: true
    timeout: 12000
  ) {
    time
  }

  # Status selector
  statusSelect: select(
    selector: "select[name='status']"
    value: "active"
    scroll: true
    timeout: 8000
  ) {
    time
  }
}`
    },
    {
        name: 'setExtraHTTPHeaders',
        description: 'Sets the HTTP headers for the page. Configures custom headers that will be sent with all subsequent requests, enabling authentication, content type control, security headers, and custom API integration for enhanced web automation workflows.',
        arguments: [
            {
                name: 'headers',
                type: '[HeaderInput]',
                description: 'The HTTP headers to set on the page',
                required: true
            }
        ],
        returns: [
            {
                name: 'time',
                type: 'Float',
                description: 'Time taken to set the HTTP headers in milliseconds'
            }
        ],
        example: `mutation SetExtraHTTPHeadersExamples {
  # Basic header setting
  setBasicHeaders: setExtraHTTPHeaders(headers: [
    {name: "Authorization", value: "Bearer token123"}
    {name: "Content-Type", value: "application/json"}
  ]) {
    time
  }

  # Multiple authentication headers
  setAuthHeaders: setExtraHTTPHeaders(headers: [
    {name: "Authorization", value: "Bearer eyJhbGciOiJIUzI1NiJ9"}
    {name: "X-API-Key", value: "api-key-12345"}
    {name: "X-Client-Version", value: "1.0.0"}
  ]) {
    time
  }

  # Custom security headers
  setSecurityHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Requested-With", value: "XMLHttpRequest"}
    {name: "X-CSRF-Token", value: "csrf-token-xyz"}
    {name: "X-Frame-Options", value: "DENY"}
  ]) {
    time
  }

  # API integration headers
  setAPIHeaders: setExtraHTTPHeaders(headers: [
    {name: "Accept", value: "application/json, text/plain, */*"}
    {name: "Content-Type", value: "application/json"}
    {name: "User-Agent", value: "Custom-Bot/1.0"}
    {name: "X-Forwarded-For", value: "203.0.113.0"}
  ]) {
    time
  }

  # Language and locale headers
  setLocaleHeaders: setExtraHTTPHeaders(headers: [
    {name: "Accept-Language", value: "en-US,en;q=0.9"}
    {name: "Accept-Encoding", value: "gzip, deflate, br"}
    {name: "X-Timezone", value: "America/New_York"}
  ]) {
    time
  }

  # Custom tracking headers
  setTrackingHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Session-ID", value: "session-abc123"}
    {name: "X-User-ID", value: "user-456789"}
    {name: "X-Request-ID", value: "req-xyz789"}
  ]) {
    time
  }

  # Cache control headers
  setCacheHeaders: setExtraHTTPHeaders(headers: [
    {name: "Cache-Control", value: "no-cache, no-store, must-revalidate"}
    {name: "Pragma", value: "no-cache"}
    {name: "Expires", value: "0"}
  ]) {
    time
  }

  # E-commerce headers
  setEcommerceHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Shop-Domain", value: "example-shop.com"}
    {name: "X-Customer-Group", value: "premium"}
    {name: "X-Currency", value: "USD"}
  ]) {
    time
  }

  # Testing headers
  setTestingHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Test-Mode", value: "true"}
    {name: "X-Test-Suite", value: "integration"}
    {name: "X-Test-Run-ID", value: "run-12345"}
  ]) {
    time
  }

  # Analytics headers
  setAnalyticsHeaders: setExtraHTTPHeaders(headers: [
    {name: "X-Analytics-ID", value: "analytics-abc123"}
    {name: "X-Referrer", value: "https://external-site.com"}
    {name: "X-Campaign", value: "summer-sale-2024"}
  ]) {
    time
  }

  # Navigate after setting headers
  goto(url: "https://example.com") {
    status
  }
}`
    },
    {
        name: 'text',
        description: 'Returns the text content on the given page or by selector when specified',
        arguments: [
            {
                name: 'timeout',
                type: 'Float',
                description: 'The maximum amount of time, in milliseconds, to wait for the selector to appear, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'selector',
                type: 'String',
                description: 'The DOM selector of the given element you want to return the text of',
                required: false
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Whether or not to return the text content of the element only if it\'s visible',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'clean',
                type: 'CleanInput',
                description: 'Specifies conditions for "cleaning" the returned text, useful for minimizing the amount of markup returned for cases like LLMs and more. See nested options for parameters',
                required: false
            }
        ],
        returns: [
            {
                name: 'text',
                type: 'String',
                description: 'Text content of the page or selected element'
            }
        ],
        example: `mutation GetText {
  goto(url: "https://example.com") {
    status
  }

  selector: text(selector: "h1") {
    text
  }

  fullPage: text {
    text
  }

  # Text with timeout
  timedText: text(
    selector: "h2"
    timeout: 10000
  ) {
    text
  }

  # Visible text only
  visibleText: text(
    selector: ".content"
    visible: true
  ) {
    text
  }

  # Cleaned text for LLM processing
  cleanedText: text(
    selector: "article"
    clean: {
      removeNonTextNodes: true
      removeExtraWhitespace: true
      maxLength: 1000
    }
  ) {
    text
  }
}`
    },
    {
        name: 'url',
        description: 'Returns the URL of the page that the browser is currently at',
        arguments: [],
        returns: [
            {
                name: 'url',
                type: 'String',
                description: 'The current URL of the page that the browser is viewing'
            }
        ],
        example: `mutation GetCurrentURL {
  # Navigate to a page
  goto(url: "https://example.com") {
    status
    url
  }
  
  # Get the current URL
  currentPage: url {
    url
  }
  
  # Navigate to another page and check URL again
  goto(url: "https://browserless.com") {
    status
  }
  
  # Get the updated URL
  newPage: url {
    url
  }
}`
    },
    {
        name: 'userAgent',
        description: 'Sets the User-Agent string for the browser session',
        arguments: [
            {
                name: 'userAgent',
                type: 'String!',
                description: 'The User-Agent string to set for the browser session',
                required: true
            }
        ],
        returns: [
            {
                name: 'userAgent',
                type: 'String',
                description: 'The User-Agent string that was set for the browser session'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'Time taken to set the User-Agent in milliseconds'
            }
        ],
        example: `mutation UserAgentExamples {
  # Set mobile iPhone User-Agent
  mobileAgent: userAgent(userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15") {
    userAgent
    time
  }
  
  # Navigate with mobile User-Agent
  goto(url: "https://example.com") {
    status
    url
  }
  
  # Set desktop Chrome User-Agent
  desktopAgent: userAgent(userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36") {
    userAgent
    time
  }
  
  # Set custom bot User-Agent
  botAgent: userAgent(userAgent: "CustomBot/1.0 (+https://example.com/bot)") {
    userAgent
    time
  }
}`
    },
    {
        name: 'type',
        description: 'Types text into an element',
        arguments: [
            {
                name: 'text',
                type: 'String!',
                description: 'Text to type',
                required: true
            },
            {
                name: 'selector',
                type: 'String!',
                description: 'CSS selector for the element',
                required: true
            },
            {
                name: 'delay',
                type: '[Int]',
                description: 'Delay range between keystrokes in milliseconds',
                required: false,
                defaultValue: '[50, 200]'
            },
            {
                name: 'wait',
                type: 'Boolean',
                description: 'Wait for element to be present',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'scroll',
                type: 'Boolean',
                description: 'Scroll to element before typing',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Only if element is visible',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'interactable',
                type: 'Boolean',
                description: 'Check if element is interactable',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'Maximum time to wait for element',
                required: false
            }
        ],
        returns: [
            {
                name: 'time',
                type: 'number',
                description: 'Time taken in milliseconds'
            }
        ],
        example: `mutation Type {
  goto(url: "https://example.com") {
    status
  }
  type(
    text: "Hello, World!"
    selector: "input[type='text']"
  ) {
    time
  }
}`
    },
    {
        name: 'solve',
        description: '🚨 **EXPERIMENTAL** 🚨 Solves a captcha or other challenge, specified by the "type" of captcha to solve. This operation is experimental and subject to change.',
        arguments: [
            {
                name: 'type',
                type: 'CaptchaTypes!',
                description: 'An enum of the type of captcha to look for and solve (e.g., hcaptcha)',
                required: true
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'A time, in milliseconds, to wait for a captcha to appear. Only valid when wait = true. If a captcha is found then this timer doesn\'t have an effect on timing-out the solve',
                required: false
            },
            {
                name: 'wait',
                type: 'Boolean',
                description: 'Whether or not to wait for the captcha to be present on the page',
                required: false,
                defaultValue: 'true'
            }
        ],
        returns: [
            {
                name: 'found',
                type: 'Boolean',
                description: 'Whether a captcha was found on the page'
            },
            {
                name: 'solved',
                type: 'Boolean',
                description: 'Whether the captcha was successfully solved'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'Time taken to solve the captcha in milliseconds'
            }
        ],
        example: `mutation SolveCaptcha {
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

  # Advanced usage with timeout
  solveWithTimeout: solve(
    type: hcaptcha
    timeout: 30000
    wait: true
  ) {
    found
    solved
    time
  }

  # Quick check without waiting
  quickCheck: solve(
    type: hcaptcha
    wait: false
  ) {
    found
    solved
    time
  }
}`
    },
    {
        name: 'title',
        description: 'Returns the title of the page that the browser is currently at',
        arguments: [],
        returns: [
            {
                name: 'title',
                type: 'String',
                description: 'The title of the current page'
            }
        ],
        example: `mutation GetTitle {
  goto(url: "https://example.com") {
    status
  }

  title {
    title
  }
}`
    },
    {
        name: 'verify',
        description: '🚨 **EXPERIMENTAL** 🚨 Clicks a verification button to assert human-like behavior. This operation is experimental and subject to change.',
        arguments: [
            {
                name: 'type',
                type: 'VerifyTypes!',
                description: 'An enum of the type of captcha to look for and solve',
                required: true
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'A time, in milliseconds, to wait for a verification to appear. Only valid when wait = true. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'wait',
                type: 'Boolean',
                description: 'Whether or not to wait for the verification to be present on the page',
                required: false,
                defaultValue: 'true'
            }
        ],
        returns: [
            {
                name: 'found',
                type: 'Boolean',
                description: 'Whether a verification challenge was found on the page'
            },
            {
                name: 'solved',
                type: 'Boolean',
                description: 'Whether the verification challenge was successfully solved'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'Time taken to solve the verification challenge in milliseconds'
            }
        ],
        example: `mutation VerifyExamples {
  # Navigate to protected page
  goto(url: "https://protected.domain") {
    status
  }

  # 🚨 EXPERIMENTAL: Verify Cloudflare challenge
  verify(type: cloudflare) {
    found
    solved
    time
  }

  # Advanced verification with timeout
  verifyWithTimeout: verify(
    type: cloudflare
    timeout: 45000
    wait: true
  ) {
    found
    solved
    time
  }

  # Quick verification check without waiting
  quickVerify: verify(
    type: cloudflare
    wait: false
  ) {
    found
    solved
    time
  }
}`
    },
    {
        name: 'waitForNavigation',
        description: 'Waits for a navigation event to fire, useful for clicking an element and waiting for a page load to complete',
        arguments: [
            {
                name: 'timeout',
                type: 'Float',
                description: 'The maximum amount of time, in milliseconds, to wait for the page to load, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'waitUntil',
                type: 'WaitUntilGoto',
                description: 'When to consider the page fully-loaded and proceed with further execution',
                required: false,
                defaultValue: 'load'
            }
        ],
        returns: [
            {
                name: 'status',
                type: 'String',
                description: 'HTTP status code of the navigation response'
            },
            {
                name: 'url',
                type: 'String',
                description: 'Final URL after navigation and any redirects'
            },
            {
                name: 'headers',
                type: 'String',
                description: 'HTTP response headers from the navigation'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'Time taken to complete the navigation in milliseconds'
            }
        ],
        example: `mutation WaitForNavigationExamples {
  # Navigate to initial page
  goto(url: "https://example.com") {
    status
  }

  # Wait for navigation with default settings
  waitForNavigation {
    status
    url
    time
  }

  # Click link and wait for navigation
  click(selector: "a[href='/products']") {
    selector
  }

  # Wait for page load with custom timeout
  waitForNavigation(
    timeout: 45000
    waitUntil: load
  ) {
    status
    url
    headers
    time
  }

  # Wait for DOM content loaded
  waitForNavigation(waitUntil: domcontentloaded) {
    status
    url
    time
  }

  # Wait for network idle
  waitForNavigation(waitUntil: networkidle) {
    status
    url
    time
  }
}`
    },
    {
        name: 'waitForRequest',
        description: 'Waits for the browser to make a particular network request, useful for monitoring API calls and resource loading',
        arguments: [
            {
                name: 'method',
                type: 'Method',
                description: 'The HTTP method of the request to wait for (GET, POST, PUT, DELETE, etc.)',
                required: false
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'How long to wait for the request to be made before timing out, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'url',
                type: 'String',
                description: 'The pattern of the request URL to wait for, using glob-style pattern-matching',
                required: false
            }
        ],
        returns: [
            {
                name: 'method',
                type: 'String',
                description: 'The HTTP method of the captured request'
            },
            {
                name: 'url',
                type: 'String',
                description: 'The URL of the captured network request'
            },
            {
                name: 'headers',
                type: 'String',
                description: 'The headers of the captured network request'
            },
            {
                name: 'postData',
                type: 'String',
                description: 'The POST data or request body of the captured request'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'Time taken to capture the network request in milliseconds'
            }
        ],
        example: `mutation WaitForRequestExamples {
  # Navigate to page that makes API calls
  goto(url: "https://browserless.io") {
    status
  }

  # Wait for any GET request
  anyGetRequest: waitForRequest(method: GET) {
    method
    url
    time
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

  # Wait for request with timeout
  timeoutRequest: waitForRequest(
    method: GET
    url: "**/analytics**"
    timeout: 45000
  ) {
    method
    url
    time
  }

  # Wait for image requests
  imageRequest: waitForRequest(url: "**/*.{jpg,png,gif}") {
    method
    url
    time
  }

  # Wait for third-party requests
  thirdPartyRequest: waitForRequest(url: "https://cdn.example.com/**") {
    method
    url
    headers
    time
  }
}`
    },
    {
        name: 'waitForResponse',
        description: 'Waits for a particular network response to be made back to the browser, useful for monitoring API responses and server communications',
        arguments: [
            {
                name: 'codes',
                type: '[Int]',
                description: 'DEPRECATED: Use `statuses` field instead as it is more consistent in BrowserQL. The HTTP Response code(s) of the URL to wait for. Can be a single HTTP code or a list of desired codes',
                required: false
            },
            {
                name: 'statuses',
                type: '[Int]',
                description: 'The HTTP Response code(s) of the URL to wait for. Can be a single HTTP code or a list of desired codes',
                required: false
            },
            {
                name: 'url',
                type: 'String',
                description: 'The pattern of the response URL to wait for, using glob-style pattern-matching',
                required: false
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'How long to wait for the response before timing out. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            }
        ],
        returns: [
            {
                name: 'status',
                type: 'Int',
                description: 'The HTTP status code of the captured response'
            },
            {
                name: 'url',
                type: 'String',
                description: 'The URL of the captured network response'
            },
            {
                name: 'headers',
                type: 'String',
                description: 'The headers of the captured network response'
            },
            {
                name: 'body',
                type: 'String',
                description: 'The response body content of the captured response'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'Time taken to capture the network response in milliseconds'
            }
        ],
        example: `mutation WaitForResponseExamples {
  # Navigate to page that receives responses
  goto(url: "https://browserless.io") {
    status
  }

  # Wait for any 200 response
  successResponse: waitForResponse(statuses: [200]) {
    status
    url
    time
  }

  # Wait for specific API response
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

  # Wait for error responses
  errorResponse: waitForResponse(
    statuses: [400, 404, 500]
    url: "**/api/**"
  ) {
    status
    url
    headers
    body
    time
  }

  # Wait for image responses
  imageResponse: waitForResponse(
    statuses: [200]
    url: "**/*.{jpg,png,gif}"
  ) {
    status
    url
    time
  }

  # Wait with custom timeout
  timeoutResponse: waitForResponse(
    statuses: [200]
    timeout: 45000
  ) {
    status
    url
    time
  }
}`
    },
    {
        name: 'waitForSelector',
        description: 'Waits for a given selector to be present in the DOM, with optional visibility checking for element timing and synchronization',
        arguments: [
            {
                name: 'selector',
                type: 'String!',
                description: 'The selector to wait for until present in the DOM',
                required: true
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'When waiting for a selector applies a timeout to wait for in milliseconds, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Whether or not to consider the element as present only if it\'s visible',
                required: false,
                defaultValue: 'false'
            }
        ],
        returns: [
            {
                name: 'selector',
                type: 'String',
                description: 'The selector that was successfully found in the DOM'
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Whether the found element is visible or not'
            },
            {
                name: 'time',
                type: 'Float',
                description: 'Time taken to find the selector in milliseconds'
            }
        ],
        example: `mutation WaitForSelectorExamples {
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

  # Wait for visible element
  visibleElement: waitForSelector(
    selector: ".dynamic-content"
    visible: true
  ) {
    selector
    visible
    time
  }

  # Wait with custom timeout
  timeoutWait: waitForSelector(
    selector: ".slow-loading"
    timeout: 60000
    visible: true
  ) {
    selector
    visible
    time
  }

  # Wait for form elements
  formReady: waitForSelector(
    selector: "form.contact-form"
    visible: true
  ) {
    selector
    visible
    time
  }

  # Wait for dynamic content
  dynamicContent: waitForSelector(
    selector: "[data-loaded='true']"
    timeout: 45000
  ) {
    selector
    visible
    time
  }
}`
    },
    {
        name: 'waitForTimeout',
        description: 'Wait for a period of time, defined in milliseconds, useful for adding delays and timing control in automation workflows',
        arguments: [
            {
                name: 'time',
                type: 'Float!',
                description: 'The amount of time to wait for, in milliseconds',
                required: true
            }
        ],
        returns: [
            {
                name: 'time',
                type: 'Float',
                description: 'The actual time waited in milliseconds'
            }
        ],
        example: `mutation WaitForTimeoutExamples {
  # Basic timeout - wait 1 second
  basicWait: waitForTimeout(time: 1000) {
    time
  }

  # Short delay for animations
  animationDelay: waitForTimeout(time: 500) {
    time
  }

  # Longer wait for processing
  processingDelay: waitForTimeout(time: 5000) {
    time
  }

  # Wait after navigation
  goto(url: "https://example.com") {
    status
  }
  
  navigationWait: waitForTimeout(time: 2000) {
    time
  }

  # Wait between interactions
  click(selector: "button.first") {
    selector
  }
  
  interactionDelay: waitForTimeout(time: 1500) {
    time
  }
  
  click(selector: "button.second") {
    selector
  }

  # Wait for network settle
  networkSettle: waitForTimeout(time: 3000) {
    time
  }
}`
    },
    {
        name: 'type',
        description: 'Types text into an element by scrolling to it, clicking it, then emitting key events for every character',
        arguments: [
            {
                name: 'text',
                type: 'String!',
                description: 'The text content you want to type into the element',
                required: true
            },
            {
                name: 'selector',
                type: 'String!',
                description: 'The CSS selector of the element on the page you want to type text into',
                required: true
            },
            {
                name: 'delay',
                type: '[Int]',
                description: 'The amount of delay between keystrokes in milliseconds. Values are used as a range and chosen at random',
                required: false,
                defaultValue: '[50, 200]'
            },
            {
                name: 'interactable',
                type: 'Boolean',
                description: 'Whether or not to check if element can be interacted with by hovering over it and seeing if the element is available at that x and y position',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'scroll',
                type: 'Boolean',
                description: 'Whether or not to scroll to the element prior to typing, defaults to true',
                required: false,
                defaultValue: 'true'
            },
            {
                name: 'timeout',
                type: 'Float',
                description: 'How long to wait for the element to appear before timing out, overriding any defaults. Default timeout is 30 seconds, or 30000',
                required: false,
                defaultValue: '30000'
            },
            {
                name: 'visible',
                type: 'Boolean',
                description: 'Whether or not to type into the element only if it\'s visible',
                required: false,
                defaultValue: 'false'
            },
            {
                name: 'wait',
                type: 'Boolean',
                description: 'Whether or not to wait for the element to present in the DOM',
                required: false,
                defaultValue: 'true'
            }
        ],
        returns: [
            {
                name: 'time',
                type: 'Float',
                description: 'Time taken to complete the typing operation in milliseconds'
            }
        ],
        example: `mutation TypeExamples {
  goto(url: "https://example.com") {
    status
  }

  # Basic typing
  basicType: type(
    selector: "input[type='text']"
    text: "Hello, World!"
  ) {
    time
  }

  # Advanced typing with custom delay
  customType: type(
    selector: "#search-input"
    text: "search query"
    delay: [100, 300]
    timeout: 10000
  ) {
    time
  }

  # Form input with validation
  formInput: type(
    selector: "input[name='email']"
    text: "user@example.com"
    visible: true
    interactable: true
  ) {
    time
  }

  # Fast typing without scroll
  fastType: type(
    selector: ".quick-input"
    text: "quick text"
    delay: [25, 50]
    scroll: false
  ) {
    time
  }
}`
    },
    {
        name: 'browser',
        description: 'The version of the browser currently being used for automation and testing',
        arguments: [],
        returns: [
            {
                name: 'browser',
                type: 'String',
                description: 'The version string of the browser (e.g., "Chrome/119.0.6045.105")'
            }
        ],
        example: `query BrowserInfo {
  # Get browser version information
  browser
  
  # Use in conditional logic
  browserVersion: browser
  
  # Combine with other queries
  systemInfo {
    browser
    version
  }
}`
    },
    {
        name: 'version',
        description: 'The version of the BrowserQL server currently running',
        arguments: [],
        returns: [
            {
                name: 'version',
                type: 'String',
                description: 'The version string of the BrowserQL server (e.g., "2.15.0")'
            }
        ],
        example: `query VersionInfo {
  # Get server version information
  version
  
  # Use for compatibility checking
  serverVersion: version
  
  # Combine with browser info
  systemInfo {
    browser
    version
  }
  
  # Version-specific logic
  versionCheck: version
}`
    }
];

/**
 * List of BrowserQL keywords
 */
export const browserQLKeywords: string[] = [
    'mutation',
    'query',
    'if',
    'ifnot',
    '@include',
    '@skip',
    'cookies',
    'evaluate',
    'forward',
    'hover',
    'html',
    'javaScriptEnabled',
    'liveURL',
    'mapSelector'
];

/**
 * List of valid waitUntil options for WaitUntilHistory enum
 * Used by: back, content, forward, reload mutations
 */
export const browserQLWaitUntilHistoryOptions: string[] = [
    'commit',
    'domContentLoaded',
    'load',
    'networkIdle'
];

/**
 * List of valid waitUntil options for WaitUntilGoto enum
 * Used by: goto mutation
 */
export const browserQLWaitUntilGotoOptions: string[] = [
    'firstMeaningfulPaint',
    'domContentLoaded',
    'networkidle0',
    'networkidle2',
    'load',
    'commit'
];

/**
 * List of valid stream type options for LiveURLStreamType enum
 * Used by: liveURL mutation
 */
export const browserQLLiveURLStreamTypeOptions: string[] = [
    'jpeg',
    'png'
];

/**
 * List of valid page format options for PDFPageFormat enum
 * Used by: pdf mutation
 */
export const browserQLPDFPageFormatOptions: string[] = [
    'letter',
    'legal',
    'tabloid',
    'ledger',
    'a0',
    'a1',
    'a2',
    'a3',
    'a4',
    'a5',
    'a6'
];

/**
 * List of valid country codes for CountryType enum
 * Used by: proxy mutation
 */
export const browserQLCountryTypeOptions: string[] = [
    'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ',
    'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS',
    'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN',
    'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE',
    'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF',
    'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM',
    'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM',
    'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC',
    'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK',
    'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA',
    'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG',
    'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW',
    'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS',
    'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO',
    'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI',
    'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW'
];

/**
 * List of valid HTTP methods for Method enum
 * Used by: proxy mutation
 */
export const browserQLMethodOptions: string[] = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'HEAD',
    'OPTIONS'
];

/**
 * List of valid operator types for OperatorTypes enum
 * Used by: proxy mutation
 */
export const browserQLOperatorTypesOptions: string[] = [
    'or',
    'and'
];

/**
 * List of valid resource types for ResourceType enum
 * Used by: proxy mutation
 */
export const browserQLResourceTypeOptions: string[] = [
    'document',
    'stylesheet',
    'image',
    'media',
    'font',
    'script',
    'texttrack',
    'xhr',
    'fetch',
    'eventsource',
    'websocket',
    'manifest',
    'other'
];

/**
 * Combined list for backward compatibility
 * @deprecated Use specific enum options instead
 */
export const browserQLWaitUntilOptions: string[] = [
    ...browserQLWaitUntilHistoryOptions,
    ...browserQLWaitUntilGotoOptions
]; 