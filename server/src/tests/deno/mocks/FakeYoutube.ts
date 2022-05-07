import { IYoutubeVideo } from "../../../main/deno/videos-provider/models/IYoutubeVideo.ts";

export const videosCollection = new Array<IYoutubeVideo>();

initDatabase();

function initDatabase() {
    insertVideo("youtube-video-01", "Video 01");
    insertVideo("youtube-video-02", "Video 02");
}

function insertVideo(id: string, title: string): void {
    const video: IYoutubeVideo = {
        id: { videoId: id },
        snippet: { title: title },
    };
    videosCollection.push(video);
}
