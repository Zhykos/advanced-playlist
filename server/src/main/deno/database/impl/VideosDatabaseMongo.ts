import { Video } from "../../../generated/deno-oak-server/models/Video.ts";
import { IVideosDatabase } from "../IVideosDatabase.ts";
import { MongoDbAtlas } from "./MongoDbAtlas.ts";

export class VideosDatabaseMongo implements IVideosDatabase {
    private mongo: MongoDbAtlas;

    constructor(mongo: MongoDbAtlas) {
        this.mongo = mongo;
    }

    getAllVideos(): Promise<Video[]> {
        return this.mongo.videosCollection.find();
    }

    async saveVideos(videos: Video[]): Promise<Video[]> {
        if (videos.length == 0) {
            return Promise.resolve([]);
        }

        const results: { insertedIds: string[] } = await this.mongo
            .videosCollection.insertMany(videos);
        for (let index = 0; index < videos.length; index++) {
            videos[index]._databaseId = results.insertedIds[index];
        }
        return Promise.resolve(videos);
    }
}
