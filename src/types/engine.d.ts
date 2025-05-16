import type { StrawSearchData } from './main.d.ts';

export interface SearchEngineOptions {
    minQueryLength?: number;
}

export default interface StrawSearchEngine {
    search(query: string): StrawSearchData[];
    getResults(): StrawSearchData[];
    setMinQueryLength(length: number): void;
}
