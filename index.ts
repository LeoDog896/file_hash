import { Application, HttpException } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { FormFile } from "https://deno.land/x/abc@v1.3.3/vendor/https/deno.land/std/mime/multipart.ts";
import { hashFromContent } from "./hash.ts";

const app = new Application();

Deno.mkdirSync("./files", { recursive: true });
const filesDir = Deno.realPathSync("./files");

console.log("http://localhost:8080/");

app
  .get("/get/:hash", (c) => {
    const hash = c.params.hash;
    const filePath = `${filesDir}/${hash}`; // path traversal vulnerability?

    return c.file(filePath);
  })
  .put("/put/", async (c) => {
    const { file } = await c.body as { file: FormFile };
    
    const hash = await hashFromContent(file.content);

    const filePath = `${filesDir}/${hash}`;

    try {
      await Deno.writeFile(filePath, file.content ?? new Uint8Array(), { createNew: true });
    } catch (e) {
      if (e instanceof Deno.errors.AlreadyExists) {
        throw new HttpException("File already exists", 409);
      }

      throw e;
    }
  })
  .delete("/delete/:hash", (c) => {
    const hash = c.params.hash;
    const filePath = `${filesDir}/${hash}`; // path traversal vulnerability?
    
    try {
      Deno.removeSync(filePath);
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        throw new HttpException("File not found", 404);
      }
    }
  })
  .get("/list", () => {
    const files = Deno.readDirSync(filesDir);
    const result = [];

    for (const file of files) {
      result.push(file.name);
    }

    return result;
  })
  .start({ port: 8080 });
