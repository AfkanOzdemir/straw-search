import type { StrawSearchData } from '../types/main.d.ts';

class StrawSearchEngine {
    private data: StrawSearchData[];
    private results: StrawSearchData[];

    constructor(data: StrawSearchData[]) {
        this.data = data;
        this.results = [];
    }

    public search(query: string) {
        if (!query || query.length < 2) {
            this.results = [];
            return [];
        }

        const queryLower = query.toLowerCase().trim();
        const queryWords = queryLower.split(/\s+/).filter(word => word.length > 1);
        
        const scoredResults = this.data.map(item => {
            const text = item.text?.toLowerCase() || '';
            let score = 0;
            
            if (text.includes(queryLower)) {
                score += 10;
            }
            
            for (const headerType of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
                const headers = item[headerType] as string[] || [];
                for (const header of headers) {
                    const headerLower = header.toLowerCase();
                    if (headerLower.includes(queryLower)) {
                        score += 5;
                        
                        if (headerLower.startsWith(queryLower)) {
                            score += 3;
                        }
                    }
                    
                    for (const word of queryWords) {
                        if (headerLower.includes(word)) {
                            score += 2;
                        }
                    }
                }
            }
            
            const paragraphs = item.p as string[] || [];
            for (const paragraph of paragraphs) {
                const paragraphLower = paragraph.toLowerCase();
                
                if (paragraphLower.includes(queryLower)) {
                    score += 3;
                    
                    const matches = paragraphLower.match(new RegExp(this.escapeRegExp(queryLower), 'g')) || [];
                    score += matches.length * 0.5;
                }
                
                for (const word of queryWords) {
                    if (paragraphLower.includes(word)) {
                        score += 1;
                    }
                }
            }
            
            return { item, score };
        });
        
        const filteredResults = scoredResults
            .filter(result => result.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(result => result.item);
        
        this.results = filteredResults;
        return this.results;
    }

    public getResults() {
        return this.results;
    }
    
    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

export default StrawSearchEngine;