import { Video } from "../../../main/generated/deno-oak-server/models/Video.ts";

export const videosCollection = new Array<Video>();

initDatabase();

function initDatabase() {
    insertVideo("video_01", "Video 01");
    insertVideo("video_02", "Vidéo 02");
}

function insertVideo(id: string, title: string): void {
    const video = new Video();
    video.id = id;
    video.title = title;
    videosCollection.push(video);
}
