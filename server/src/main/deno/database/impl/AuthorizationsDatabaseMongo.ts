import { authCollection } from "./MongoDbAtlas.ts";
import { IAuthorizationsDatabase } from "../IAuthorizationsDatabase.ts";
import { YoutubeAuth } from "../models/impl/YoutubeAuth.ts";

export class AuthorizationsDatabaseMongo implements IAuthorizationsDatabase {
    getProviderAuth(): Promise<YoutubeAuth> {
        return authCollection.findOne({ provider: "youtube" }) as Promise<
            YoutubeAuth
        >;
    }
}
