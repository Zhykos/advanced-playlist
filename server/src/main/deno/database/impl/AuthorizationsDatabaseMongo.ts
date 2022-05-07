import { MongoDbAtlas } from "./MongoDbAtlas.ts";
import { IAuthorizationsDatabase } from "../IAuthorizationsDatabase.ts";
import { YoutubeAuth } from "../models/impl/YoutubeAuth.ts";
import { IProviderAuthDatabase } from "../models/IProviderAuthDatabase.ts";

export class AuthorizationsDatabaseMongo implements IAuthorizationsDatabase {
    private mongo: MongoDbAtlas;

    constructor(mongo: MongoDbAtlas) {
        this.mongo = mongo;
    }

    async getYoutubeProviderAuth(): Promise<YoutubeAuth> {
        const auth: IProviderAuthDatabase = await this.mongo.findAuthProvider(
            "youtube",
        );
        const split: string[] = auth.data[0].split("=");
        return Promise.resolve(new YoutubeAuth(split[1]));
    }
}
