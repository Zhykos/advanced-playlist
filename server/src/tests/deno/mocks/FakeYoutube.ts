import { YoutubeChannel } from "../../../main/deno/models/youtube/YoutubeChannel.ts";

export const channelsCollection = new Array<YoutubeChannel>();

initDatabase();

function initDatabase() {
    insertChannel("channel", "Channel 01");
    insertChannel("channel_02", "Chaîne 02");
}

function insertChannel(id: string, title: string): void {
    const channel: YoutubeChannel = {
        pageInfo: { totalResults: 1 },
        items: [{ id: id, snippet: { id: title } }],
    };
    channelsCollection.push(channel);
}
