import { assertEquals } from "./deps.ts";
import { Video } from "../../main/generated/deno-oak-server/models/Video.ts";

Deno.test("copy video", () => {
    const video: Video = new Video();
    assertEquals(video.id, undefined);
    assertEquals(video.title, undefined);

    video.copyFrom({ id: "id", title: "title" });

    assertEquals(video.id, "id");
    assertEquals(video.title, "title");
});
