export function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split(".")[1] ?? "";
    const decodedJson = JSON.parse(
      Buffer.from(payloadBase64, "base64").toString()
    );
    const { exp } = decodedJson;
    const now = Date.now() / 1000;

    // Buffer of 10 seconds to be safe.
    return exp < now + 10;
  } catch {
    return true;
  }
}
