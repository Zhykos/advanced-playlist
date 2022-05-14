import { crypto, writableStreamFromWriter } from "./deps.ts";

const baseUrl =
    "https://github.com/Zhykos/deno-server-openapi-generator/releases/download/0.4.1-beta/";
const jarFilename = "openapi-generator-cli.jar";
const hashFilename = "openapi-generator-cli.sha256";
const targetDirectory = "./openapi-generator/";

await download(baseUrl, jarFilename);
await download(baseUrl, hashFilename);

const expectedHashFileContent: string = Deno.readTextFileSync(
    targetDirectory + hashFilename,
);
const expectedHashFile: string = expectedHashFileContent.split(" ")[0];
const actualHashFile: string = await sha256digestJarFile();

if (actualHashFile === expectedHashFile) {
    console.log("JAR is validated.");
} else {
    console.error(
        `JAR is not validated: different hash! Expected = '${expectedHashFile}' ; Actual = '${actualHashFile}'.`,
    );
}

async function download(baseUrl: string, filename: string): Promise<void> {
    const fileResponse = await fetch(baseUrl + filename);
    if (fileResponse.body && fileResponse.status == 200) {
        const file = await Deno.open(targetDirectory + filename, {
            write: true,
            create: true,
        });
        const writableStream = writableStreamFromWriter(file);
        await fileResponse.body.pipeTo(writableStream);
        console.log(
            `File downloaded '${filename}' from URL '${baseUrl + filename}'.`,
        );
    } else {
        console.error(`Cannot download file from URL '${baseUrl + filename}'.`);
    }
}

// https://developer.mozilla.org/fr/docs/Web/API/SubtleCrypto/digest
async function sha256digestJarFile(): Promise<string> {
    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        Deno.readFileSync(targetDirectory + jarFilename),
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
