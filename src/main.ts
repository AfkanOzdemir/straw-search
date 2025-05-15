// Strawsearch is a search inapp search engine that allows you to search for anything in your app. 
import type { StrawSearchData, StrawSearchOptions } from './types/main.d.ts';
import StrawSearchEngine from './core/engine.js';

class StrawSearch {
  private inputElement: HTMLInputElement;
  private resultsElement: HTMLDivElement;
  private dataUrl: string;
  private isData: boolean;
  private data: StrawSearchData[];
  private hiyerarchy: string[];
  private searchQuery: string = '';

  constructor(options: StrawSearchOptions) {
    // Default Options
    this.inputElement = options.inputElement;
    this.resultsElement = options.resultsElement;
    this.dataUrl = options.dataUrl;

    // Other Options
    this.data = options.data;
    this.isData = false;
    this.hiyerarchy = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'a'];
    
    // Initialize
    this.init();
  }

  showResults(results: StrawSearchData[]) {
    if (this.resultsElement && results) {
      this.resultsElement.style.display = 'flex';
      this.resultsElement.innerHTML = '';

      results.forEach((result) => {
        let headContent = '';
        for (const tag of this.hiyerarchy) {
          if (result[tag] && Array.isArray(result[tag]) && result[tag].length > 0) {
            headContent = result[tag][0];
            break;
          }
        }
        
        let content = '';
        if (result.p && Array.isArray(result.p) && result.p.length > 0) {
          let longestParagraph = '';
          for (const paragraph of result.p) {
            if (paragraph.length > longestParagraph.length) {
              longestParagraph = paragraph;
            }
          }
          
          content = longestParagraph.length > 100 
            ? longestParagraph.substring(0, 100) + '...' 
            : longestParagraph;
        }
        
        // Aranan kelimeyi vurgula
        if (this.searchQuery && this.searchQuery.length > 1) {
          const regex = new RegExp(this.escapeRegExp(this.searchQuery), 'gi');
          headContent = headContent.replace(regex, match => 
            `<span style="background-color: yellow;">${match}</span>`);
          content = content.replace(regex, match => 
            `<span style="background-color: yellow;">${match}</span>`);
        }

        const resultContainer = document.createElement('ul');
        this.resultsElement.appendChild(resultContainer);
        resultContainer.classList.add('strawsearch-result-list-item');
        resultContainer.innerHTML = `<li><a href="${result.url}"><span>${headContent}</span><p>${content}</p></a></li>`;
        this.resultsElement.appendChild(resultContainer);
      });
    } else {
      this.resultsElement.style.display = 'none';
    }
  }

  // Regex için özel karakterleri escape et
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getDataUrl() {
    if (this.isData) return;
    fetch(this.dataUrl)
      .then(response => response.json())
      .then(data => {
        this.data = data;
        this.isData = true;
      });
  }

  useEngine() {
    const engine = new StrawSearchEngine(this.data);
    this.searchQuery = this.inputElement.value;
    const results = engine.search(this.searchQuery);
    this.showResults(results as StrawSearchData[]);
    return engine;
  }

  init() {
    this.resultsElement.style.display = 'none';
    this.inputElement.addEventListener('input', () => {
      this.getDataUrl();
      this.useEngine();
    });
  }
}

export default StrawSearch;