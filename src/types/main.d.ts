export interface StrawSearchOptions {
    inputElement?: HTMLInputElement;
    resultsElement?: HTMLDivElement;
    dataUrl?: string;
    isData?: boolean;
    data?: StrawSearchData[]
}

export interface StrawSearchData {
    url?: string;
    text?: string;
    headContent?: string;
    textContent?: string;
    h1?: string[];
    h2?: string[];
    h3?: string[];
    h4?: string[];
    h5?: string[];
    h6?: string[];
    p?: string[];
    li?: string[];
    a?: Array<{text: string, href: string}>;
    [key: string]: any; // Index signature ile herhangi bir HTML tag'ı için destek sağla
}