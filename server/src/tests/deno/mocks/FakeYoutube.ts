import { IYoutubeChannel } from "../../../main/deno/videos-provider/models/IYoutubeChannel.ts";
import { IYoutubeVideo } from "../../../main/deno/videos-provider/models/IYoutubeVideo.ts";

export const videosCollection: IYoutubeVideo[] = [];

export const channelsCollection: IYoutubeChannel[] = [];

initDatabase();

function initDatabase() {
    insertVideo("youtube-video-01", "Video 01");
    insertVideo("youtube-video-02", "Video 02");

    insertChannel("youtube-channel-01", "Channel 01");
}

function insertVideo(id: string, title: string): void {
    const video: IYoutubeVideo = {
        id: { videoId: id },
        snippet: { title: title },
    };
    videosCollection.push(video);
}

function insertChannel(id: string, title: string): void {
    const channel: IYoutubeChannel = {
        id: id,
        snippet: { title: title },
    };
    channelsCollection.push(channel);
}
