import { IYoutubeVideo } from "../../../main/deno/models/youtube/IYoutubeVideo.ts";
import { YoutubeChannel } from "../../../main/deno/models/youtube/YoutubeChannel.ts";

export const channelsCollection = new Array<YoutubeChannel>();

export const videosCollection = new Array<IYoutubeVideo>();

initDatabase();

function initDatabase() {
    insertChannel("youtube-channel-01", "Channel 01");

    insertVideo("youtube-video-01", "Video 01");
    insertVideo("youtube-video-02", "Video 02");
}

function insertChannel(id: string, title: string): void {
    const channel: YoutubeChannel = {
        pageInfo: { totalResults: 1 },
        items: [{ id: id, snippet: { id: title } }],
    };
    channelsCollection.push(channel);
}

function insertVideo(id: string, title: string): void {
    const video: IYoutubeVideo = {
        id: { videoId: id },
        snippet: { title: title },
    };
    videosCollection.push(video);
}
