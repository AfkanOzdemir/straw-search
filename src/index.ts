// Main module exports
export { default as StrawSearch } from './main.js';
export { crawlSite } from './crawler.js';
export { default as StrawSearchEngine } from './core/engine.js';

// Type exports
export type { StrawSearchOptions, StrawSearchData } from './types/main.d.ts';
export type { CrawlerOptions, CrawlerResult, CrawlerError } from './types/crawler.d.ts';
