import { Channel } from "../../../generated/deno-oak-server/models/Channel.ts";
import { ISubscriptionsDatabase } from "../ISubscriptionsDatabase.ts";
import { MongoDbAtlas } from "./MongoDbAtlas.ts";

export class SubscriptionsDatabaseMongo implements ISubscriptionsDatabase {
    private mongo: MongoDbAtlas;

    constructor(mongo: MongoDbAtlas) {
        this.mongo = mongo;
    }

    getSubscribedChannels(): Promise<Channel[]> {
        return this.mongo.channelsCollection.find();
    }

    async subscribeToChannel(channel: Channel): Promise<Channel> {
        const result: { insertedId: string } = await this.mongo
            .channelsCollection.insertOne(channel);
        channel._databaseId = result.insertedId;
        return Promise.resolve(channel);
    }
}
