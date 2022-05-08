import { Helpers } from "../../main/generated/deno-oak-server/controllers/Helpers.ts";
import { assertEquals, returnsNext, stub } from "./deps.ts";

Deno.test("isJsonBody", () => {
    const headers: Headers = new Headers();
    stub(headers, "get", returnsNext(["application/json"]));
    assertEquals(Helpers.isJsonBody(headers), true);
});

Deno.test("not isJsonBody", () => {
    const headers: Headers = new Headers();
    stub(headers, "get", returnsNext(["foo"]));
    assertEquals(Helpers.isJsonBody(headers), false);
});

Deno.test("isFormDataBody", () => {
    const headers: Headers = new Headers();
    stub(headers, "get", returnsNext(["multipart/form-data;hello there"]));
    assertEquals(Helpers.isFormDataBody(headers), true);
});

Deno.test("not isFormDataBody", () => {
    const headers: Headers = new Headers();
    stub(headers, "get", returnsNext(["foo"]));
    assertEquals(Helpers.isFormDataBody(headers), false);
});

Deno.test("no content type", () => {
    const headers: Headers = new Headers();
    assertEquals(Helpers.isFormDataBody(headers), false);
});

Deno.test("wrapPromise", async () => {
    const result: string = await Helpers.wrapPromise("foo");
    assertEquals(result, "foo");
});
