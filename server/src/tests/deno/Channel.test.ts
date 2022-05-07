import { assertEquals } from "./deps.ts";
import { Channel } from "../../main/generated/deno-oak-server/models/Channel.ts";

Deno.test("copy channel", () => {
    const channel: Channel = new Channel();
    assertEquals(channel.id, undefined);
    assertEquals(channel.title, undefined);

    channel.copyFrom({ id: "id", title: "title" });

    assertEquals(channel.id, "id");
    assertEquals(channel.title, "title");
});
