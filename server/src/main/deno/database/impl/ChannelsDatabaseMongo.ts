import { Channel } from "../../../generated/deno-oak-server/models/Channel.ts";
import { IChannelsDatabase } from "../IChannelsDatabase.ts";
import { MongoDbAtlas } from "./MongoDbAtlas.ts";

export class ChannelsDatabaseMongo implements IChannelsDatabase {
    private mongo: MongoDbAtlas;

    constructor(mongo: MongoDbAtlas) {
        this.mongo = mongo;
    }

    getSubscribedChannels(): Promise<Channel[]> {
        return this.mongo.channelsCollection.find();
    }

    async hasSubscribedChannel(id: string): Promise<boolean> {
        const channel: Channel = await this.mongo.channelsCollection.findOne({
            id: id,
        });
        return channel !== null;
    }

    async subscribeToChannel(channel: Channel): Promise<Channel> {
        const result: { insertedId: string } = await this.mongo
            .channelsCollection.insertOne(channel);
        channel._databaseId = result.insertedId;
        return Promise.resolve(channel);
    }
}
