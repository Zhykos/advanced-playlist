import { IYoutubeVideo } from "../../../main/deno/models/youtube/IYoutubeVideo.ts";
import { YoutubeChannel } from "../../../main/deno/models/youtube/YoutubeChannel.ts";

export const channelsCollection = new Array<YoutubeChannel>();

export const videosCollection = new Array<IYoutubeVideo>();

initDatabase();

function initDatabase() {
    insertChannel("channel", "Channel 01");

    insertVideo("video-01-channel-01", "Video 01");
    insertVideo("video-02-channel-01", "Video 02");
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
