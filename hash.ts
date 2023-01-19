export async function hashFromFile(file: string) {
  return hashFromContent(await Deno.readFile(file));
}

export async function hashFromContent(content: Uint8Array | undefined) {
    const a = await crypto.subtle.digest(
        "SHA-512",
        content ?? new Uint8Array(),
    );
    
    // get hex string from ArrayBuffer
    return Array.from(new Uint8Array(a))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}