import { assertEquals } from "https://deno.land/std@0.173.0/testing/asserts.ts";
import { hashFromFile } from "../hash.ts";

Deno.test("hash a file", async () => {
  const url = new URL("./hashable.txt", import.meta.url);
  const hash = await hashFromFile(url.pathname);

  assertEquals(hash, "55a3edaec6e34fe609be36fd00235b27525629cb6c40c835d171cbe15da5354c2c89ad09f131706ff5c29f009d9aa0932722ef572d759c787d2e786605e90f73");

})