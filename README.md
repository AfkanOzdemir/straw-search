# StrawSearch

**StrawSearch** is a tool that indexes websites and allows you to perform searches on them.

![Cryptoria Password Generator](/public/strawSearchLogo.png)

## Installation

```bash
npm install straw-search
```

## Usage

### Indexing Web Pages via CLI

To index a website using the CLI:

```bash
npx crawler https://example.com
```

This command will crawl the website and generate an `index.json` file. To specify a custom output file:

```bash
npx crawler https://example.com -o custom-index.json
```

### Usage in JavaScript/TypeScript

#### Indexing a Web Page

```js
import { crawlSite } from 'straw-search';

// Index a website
await crawlSite({
  rootUrl: 'https://example.com',
  outputFile: 'index.json'
});
```

#### Searching in Indexed Data

To use the search engine in a web interface:

```js
import { StrawSearch } from 'straw-search';

// HTML elements
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// Initialize the search engine
const searcher = new StrawSearch({
  inputElement: searchInput,
  resultsElement: searchResults,
  dataUrl: '/index.json',  // Path to the indexed data
  isData: false,
  data: []
});
```

To use as a standalone search engine:

```js
import { StrawSearchEngine } from 'straw-search';
import indexData from './index.json';

// Create a new search engine instance
const engine = new StrawSearchEngine(indexData);

// Perform a search
const results = engine.search('search keyword');
console.log(results);
```

## API Reference

### `crawlSite(options)`

Crawls and indexes a website.

**Parameters:**

* `options.rootUrl`: The root URL to crawl
* `options.outputFile`: File path to save the indexed data

### `StrawSearch`

Creates a search widget for web interfaces.

**Parameters:**

* `options.inputElement`: HTML input element for the search
* `options.resultsElement`: HTML element to display results
* `options.dataUrl`: URL of the indexed data
* `options.isData`: Whether data is preloaded
* `options.data`: Indexed data (optional)

### `StrawSearchEngine`

Standalone search engine.

**Methods:**

* `search(query)`: Performs a search and returns results
* `getResults()`: Returns the results of the last search

## License

MIT
