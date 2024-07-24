let subtleCrypto: SubtleCrypto;

if (typeof window !== 'undefined' && window.crypto) {
  // Browser environment
  subtleCrypto = window.crypto.subtle;
} else if (typeof global !== 'undefined' && (global as any).crypto) {
  // Node.js environment
  subtleCrypto = (global as any).crypto.webcrypto.subtle;
} else {
  throw new Error('No Web Crypto API available.');
}

const base64UrlEncode = (buffer: ArrayBuffer): string => {
  const uint8Array = new Uint8Array(buffer);
  return btoa(String.fromCharCode(...uint8Array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const base64UrlDecode = (base64: string): ArrayBuffer => {
  const base64WithPadding = base64 + '='.repeat((4 - base64.length % 4) % 4);
  const binaryString = atob(base64WithPadding.replace(/-/g, '+').replace(/_/g, '/'));
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const hmacSign = async (key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> => {
  return await subtleCrypto.sign('HMAC', key, data);
};

const hmacVerify = async (key: CryptoKey, data: ArrayBuffer, signature: ArrayBuffer): Promise<boolean> => {
  return await subtleCrypto.verify('HMAC', key, signature, data);
};

interface JwtPayload {
  [key: string]: any;
  id: string | number;
  iat: number;
  exp?: number;
}

interface JwtHeader {
  alg: string;
  typ: string;
}

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

export const decode_jwt = async (secret: string, jwt: string): Promise<{ id: string | number, payload: object, expires_at?: Date }> => {
  const [encodedHeader, encodedPayload, encodedSignature] = jwt.split('.');
  
  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    throw new Error('Invalid JWT format');
  }

  const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedHeader))) as JwtHeader;
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload))) as JwtPayload;

  const key = await subtleCrypto.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['verify']
  );

  const signatureValid = await hmacVerify(
    key,
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
    base64UrlDecode(encodedSignature)
  );

  if (!signatureValid) {
    throw new Error('Invalid signature');
  }

  return {
    id: payload.id,
    payload,
    expires_at: payload.exp ? new Date(payload.exp * 1000) : undefined,
  };
};

export const validate_jwt = async (secret: string, jwt: string): Promise<boolean> => {
  try {
    const { expires_at } = await decode_jwt(secret, jwt);
    if (expires_at && expires_at.getTime() < Date.now()) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};
