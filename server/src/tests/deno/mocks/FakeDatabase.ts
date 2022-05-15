import { Channel } from "../../../main/generated/deno-oak-server/models/Channel.ts";
import { Video } from "../../../main/generated/deno-oak-server/models/Video.ts";

export const videosCollection: Video[] = [];
export const channelsCollection: Channel[] = [];

initDatabase();

function initDatabase() {
    const channel01: Channel = insertChannel(
        "database-channel-01",
        "Channel 01",
    );

    insertVideo("database-video-01", "Video 01", channel01);
    insertVideo("database-video-02", "Video 02", channel01);
}

function insertVideo(id: string, title: string, channel: Channel): void {
    const video = new Video();
    video.id = id;
    video.title = title;
    video.channel = channel;
    videosCollection.push(video);
}

function insertChannel(id: string, title: string): Channel {
    const channel = new Channel();
    channel.id = id;
    channel.title = title;
    channelsCollection.push(channel);
    return channel;
}
