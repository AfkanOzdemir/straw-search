export interface CrawlerOptions {
    rootUrl: string;
    outputFile: string;
}

export interface CrawlerResult {
    url: string;
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
    p: string[];
    li: string[];
    a: { text: string; href: string }[];
    text: string;
}

export interface CrawlerError {
    message: string;
    url: string;
}