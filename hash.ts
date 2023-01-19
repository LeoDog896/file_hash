export async function hashFromFile(file: string) {
  const a = await crypto.subtle.digest(
    "SHA-512",
    await Deno.readFile(file),
  );

  // get hex string from ArrayBuffer
  return Array.from(new Uint8Array(a))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
