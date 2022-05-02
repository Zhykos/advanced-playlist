import { Video } from "../../generated/deno-oak-server/models/Video.ts";
import { AuthYoutube } from "../models/youtube/AuthYoutube.ts";
import { IAuth } from "../models/IAuth.ts";
import { IVideosDatabase, ProviderArg } from "./IVideosDatabase.ts";
import { authCollection, videosCollection } from "./MongoDbAtlas.ts";

export class VideosDatabaseMongoDbAtlas implements IVideosDatabase {
    getAuthProvider( // FIXME rien à foutre ici !!!!!!!!!!!
        arg: ProviderArg & { name: "youtube" },
    ): Promise<AuthYoutube> {
        return this.internalGetAuthProvider(arg.name);
    }

    getAllVideos(): Promise<Video[]> {
        return videosCollection.find();
    }

    private internalGetAuthProvider(name: string): Promise<IAuth> {
        return authCollection.findOne({ provider: name });
    }
}
