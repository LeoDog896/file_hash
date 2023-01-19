import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";

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
