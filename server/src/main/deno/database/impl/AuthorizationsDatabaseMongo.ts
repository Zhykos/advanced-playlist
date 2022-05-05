import { authCollection } from "./MongoDbAtlas.ts";
import { IAuthorizationsDatabase } from "../IAuthorizationsDatabase.ts";
import { YoutubeAuth } from "../models/impl/YoutubeAuth.ts";
import { IProviderAuthDatabase } from "file:///C:/Users/Zhykos/Documents/dev/advanced-playlist/server/src/main/deno/database/models/IProviderAuthDatabase.ts";

export class AuthorizationsDatabaseMongo implements IAuthorizationsDatabase {
    async getYoutubeProviderAuth(): Promise<YoutubeAuth> {
        const auth: IProviderAuthDatabase = await authCollection.findOne({
            provider: "youtube",
        });
        const split: string[] = auth.data[0].split("=");
        return new Promise((resolve) => resolve(new YoutubeAuth(split[1])));
    }
}
