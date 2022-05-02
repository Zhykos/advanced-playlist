import { Channel } from "../../generated/deno-oak-server/models/Channel.ts";
import { ISubscriptionsDatabase } from "./ISubscriptionsDatabase.ts";
import { channelsCollection } from "./MongoDbAtlas.ts";

export class SubscriptionsDatabaseMongo implements ISubscriptionsDatabase {
    getSubscribedChannels(): Promise<Channel[]> {
        return channelsCollection.find();
    }
}
