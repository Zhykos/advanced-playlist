export interface IYoutubeVideo {
    id: Id;
    snippet: Snippet;
}

interface Id {
    videoId: string;
}

interface Snippet {
    title: string;
}
