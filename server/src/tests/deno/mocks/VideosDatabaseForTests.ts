import {
    IVideosDatabase,
    ProviderArg,
} from "../../../main/deno/database/IVideosDatabase.ts";
import { Video } from "../../../main/generated/deno-oak-server/models/Video.ts";
import { videosCollection } from "./FakeDatabase.ts";
import { Helpers } from "../../../main/generated/deno-oak-server/controllers/Helpers.ts";
import { AuthYoutube } from "../../../main/deno/models/AuthYoutube.ts";

export class VideosDatabaseForTests implements IVideosDatabase {
    getAuthProvider(
        _arg: ProviderArg & { name: "youtube" },
    ): Promise<AuthYoutube> {
        return Helpers.wrapPromise(new AuthYoutube(""));
    }
    async getAllVideos(): Promise<Video[]> {
        return Helpers.wrapPromise(videosCollection);
    }
}
