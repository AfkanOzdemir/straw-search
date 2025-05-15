import type { StrawSearchData } from '../types/main.d.ts';
class StrawSearchEngine {
    private data: StrawSearchData[];
    private results: StrawSearchData[];

    constructor(data: StrawSearchData[]) {
        this.data = data;
        this.results = [];
    }

    public search(query: string) {
        if (query.length < 2) {
            this.results = [];
            return;
        }
        const results = this.data.filter((item) => {
            const text = item.text?.toLowerCase();
            const queryLower = query.toLowerCase();
            return text?.includes(queryLower);
        });
        console.log(results);
        this.results = results;
        return this.results;
    }

    public getResults() {
        return this.results;
    }
}

export default StrawSearchEngine;