// Strawsearch is a search inapp search engine that allows you to search for anything in your app. 
import type { StrawSearchData, StrawSearchOptions } from './types/main.d.ts';
import StrawSearchEngine from './core/engine.js';

class StrawSearch {
  private inputElement?: HTMLInputElement;
  private resultsElement?: HTMLDivElement;
  private dataUrl?: string;
  private isData: boolean;
  private data: StrawSearchData[];
  private hiyerarchy: string[];
  private searchQuery: string = '';
  private isBrowser: boolean;

  constructor(options: StrawSearchOptions) {
    this.isBrowser = typeof window !== 'undefined';
    
    this.inputElement = options.inputElement;
    this.resultsElement = options.resultsElement;
    this.dataUrl = options.dataUrl;

    this.data = options.data || [];
    this.isData = !!options.data?.length || false;
    this.hiyerarchy = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'a'];
    
    if (this.isBrowser && this.inputElement && this.resultsElement) {
      this.init();
    }
  }

  showResults(results: StrawSearchData[]) {
    if (!this.isBrowser || !this.resultsElement) return;
    
    this.resultsElement.style.display = 'flex';
    this.resultsElement.innerHTML = '';

    if (results.length === 0 && this.searchQuery.length >= 2) {
      const noResultsMsg = document.createElement('div');
      noResultsMsg.classList.add('strawsearch-no-results');
      noResultsMsg.innerHTML = `<p>No results found for: "${this.searchQuery}"</p>`;
      this.resultsElement.appendChild(noResultsMsg);
      return;
    }

    results.forEach((result) => {
      let headContent = '';
      for (const tag of this.hiyerarchy) {
        if (result[tag] && Array.isArray(result[tag]) && result[tag].length > 0) {
          headContent = result[tag][0];
          break;
        }
      }
      
      let content = '';
      let bestParagraph = '';
      
      if (result.p && Array.isArray(result.p) && result.p.length > 0) {
        const matchingParagraphs = result.p.filter(p => 
          p.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        
        if (matchingParagraphs.length > 0) {
          bestParagraph = matchingParagraphs.reduce((best, current) => {
            const termPos = current.toLowerCase().indexOf(this.searchQuery.toLowerCase());
            const contextStart = Math.max(0, termPos - 50);
            const contextEnd = Math.min(current.length, termPos + this.searchQuery.length + 50);
            const context = current.substring(contextStart, contextEnd);
            
            if (!best || context.length > best.length) {
              return context;
            }
            return best;
          }, '');
        } else {
          bestParagraph = result.p.reduce((longest, current) => 
            current.length > longest.length ? current : longest, '');
          
          if (bestParagraph.length > 150) {
            bestParagraph = bestParagraph.substring(0, 150) + '...';
          }
        }
        
        content = bestParagraph;
      }
      
      if (this.searchQuery && this.searchQuery.length > 1) {
        const regex = new RegExp(`(${this.escapeRegExp(this.searchQuery)})`, 'gi');
        headContent = headContent.replace(regex, '<span class="strawsearch-highlight">$1</span>');
        content = content.replace(regex, '<span class="strawsearch-highlight">$1</span>');
      }

      const resultContainer = document.createElement('div');
      resultContainer.classList.add('strawsearch-result-item');
      
      const displayUrl = result.url ? new URL(result.url).pathname : '';
      
      resultContainer.innerHTML = `
        <div class="strawsearch-result-header">
          <a href="${result.url || '#'}" class="strawsearch-result-title">${headContent || 'No title found'}</a>
          <span class="strawsearch-result-url">${displayUrl}</span>
        </div>
        <div class="strawsearch-result-content">${content}</div>
      `;
      
      if (this.resultsElement) {
        this.resultsElement.appendChild(resultContainer);
      }
    });
    
    this.addStyles();
  }
  
  private addStyles() {
    if (!this.isBrowser) return;
    if (!document.getElementById('strawsearch-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'strawsearch-styles';
      styleElement.textContent = `
        .strawsearch-result-item {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          width: 100%;
          transition: transform 0.2s ease;
        }
        .strawsearch-result-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .strawsearch-result-header {
          margin-bottom: 0.5rem;
        }
        .strawsearch-result-title {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a73e8;
          text-decoration: none;
          margin-bottom: 0.25rem;
        }
        .strawsearch-result-url {
          font-size: 0.85rem;
          color: #0e7d27;
        }
        .strawsearch-result-content {
          font-size: 0.95rem;
          color: #333;
          line-height: 1.5;
        }
        .strawsearch-highlight {
          background-color: #ffeaa0;
          border-radius: 2px;
          padding: 0 2px;
          font-weight: bold;
        }
        .strawsearch-no-results {
          text-align: center;
          padding: 2rem;
          color: #666;
          width: 100%;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async getDataUrl() {
    if (this.isData || !this.dataUrl || !this.isBrowser) return;
    
    try {
      const response = await fetch(this.dataUrl);
      this.data = await response.json();
      this.isData = true;
    } catch (error) {
      console.error('StrawSearch: Error loading data', error);
    }
  }

  search(query: string) {
    this.searchQuery = query;
    const engine = new StrawSearchEngine(this.data);
    const results = engine.search(query);
    
    if (this.isBrowser && this.resultsElement) {
      this.showResults(results as StrawSearchData[]);
    }
    
    return results;
  }

  init() {
    if (!this.isBrowser || !this.inputElement || !this.resultsElement) return;
    
    this.resultsElement.style.display = 'none';
    this.inputElement.addEventListener('input', async () => {
      await this.getDataUrl();
      if (this.inputElement) {
        this.searchQuery = this.inputElement.value;
        this.search(this.searchQuery);
      }
    });
  }
  
  getData() {
    return this.data;
  }
  
  setData(data: StrawSearchData[]) {
    this.data = data;
    this.isData = true;
  }
}

export default StrawSearch;