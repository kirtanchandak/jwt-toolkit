import { subtleCrypto } from "./crypto";

const base64UrlEncode = (buffer: ArrayBuffer): string => {
    const uint8Array = new Uint8Array(buffer);
    return btoa(String.fromCharCode(...uint8Array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

const hmacSign = async (key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> => {
    return await subtleCrypto.sign('HMAC', key, data);
  };

  export const encode_jwt = async (
    secret: string,
    id: string | number,
    payload: object,
    ttl?: number
  ): Promise<string> => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const timestamp = Math.floor(Date.now() / 1000);
    const jwtPayload = { ...payload, id, iat: timestamp, exp: ttl ? timestamp + ttl : undefined };
  
    const encodedHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
    const encodedPayload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(jwtPayload)));
  
    const key = await subtleCrypto.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: { name: 'SHA-256' } },
      false,
      ['sign']
    );
  
    const signature = await hmacSign(key, new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`));
    const encodedSignature = base64UrlEncode(signature);
  
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  };