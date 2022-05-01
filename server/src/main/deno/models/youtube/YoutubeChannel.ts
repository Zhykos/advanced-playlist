export interface YoutubeChannel {
    pageInfo: PageInfo;
    items: Item[];
}

interface PageInfo {
    totalResults: number;
}

interface Item {
    id: string;
    snippet: Snippet;
}

interface Snippet {
    id: string;
}
