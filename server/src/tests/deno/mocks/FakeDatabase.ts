import { Channel } from "../../../main/generated/deno-oak-server/models/Channel.ts";
import { Video } from "../../../main/generated/deno-oak-server/models/Video.ts";

export const videosCollection = new Array<Video>();
export const channelsCollection = new Array<Channel>();

initDatabase();

function initDatabase() {
    videosCollection.length = 0;
    channelsCollection.length = 0;

    const channel01: Channel = insertChannel("channel-01", "Channel 01");

    insertVideo("video_01", "Video 01", channel01);
    insertVideo("video_02", "Vidéo 02", channel01);
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
