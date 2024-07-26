import { subtleCrypto } from "./crypto";
import { JwtHeader, JwtPayload } from "./types";

const base64UrlDecode = (base64: string): Uint8Array => {
  const base64WithPadding = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binaryString = atob(
    base64WithPadding.replace(/-/g, "+").replace(/_/g, "/")
  );
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const hmacVerify = async (key: CryptoKey, data: ArrayBuffer, signature: Uint8Array): Promise<boolean> => {
    return await subtleCrypto.verify('HMAC', key, signature, data);
  };

export const decode_jwt = async (
  secret: string,
  jwt: string
): Promise<{ id: string | number; payload: object; expires_at?: Date }> => {
  const [encodedHeader, encodedPayload, encodedSignature] = jwt.split(".");

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    throw new Error("Invalid JWT format");
  }

  const header = JSON.parse(
    new TextDecoder().decode(base64UrlDecode(encodedHeader))
  ) as JwtHeader;
  const payload = JSON.parse(
    new TextDecoder().decode(base64UrlDecode(encodedPayload))
  ) as JwtPayload;

  const key = await subtleCrypto.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["verify"]
  );

  const signatureValid = await hmacVerify(
    key,
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
    base64UrlDecode(encodedSignature)
  );

  if (!signatureValid) {
    throw new Error("Invalid signature");
  }

  return {
    id: payload.id,
    payload,
    expires_at: payload.exp ? new Date(payload.exp * 1000) : undefined,
  };
};
