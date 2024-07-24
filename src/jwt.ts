interface JwtPayload {
  [key: string]: any; // Allows for additional custom claims
  exp?: number;       // Expiration time (UNIX timestamp)
  iat?: number;       // Issued at time (UNIX timestamp)
  id: string | number; // Unique identifier for the JWT
}

const base64UrlEncode = (str: Uint8Array): string => {
  return Buffer.from(str).toString('base64')        // Encode to base64
      .replace(/\+/g, '-')                           // Replace '+' with '-'
      .replace(/\//g, '_')                           // Replace '/' with '_'
      .replace(/=+$/, '');                           // Remove trailing '='
};

const base64UrlDecode = (str: string): Uint8Array => {
  str = str
      .replace(/-/g, '+')                           // Replace '-' with '+'
      .replace(/_/g, '/');                           // Replace '_' with '/'

  const padding = '='.repeat((4 - (str.length % 4)) % 4);
  const base64 = str + padding;
  return new Uint8Array(Buffer.from(base64, 'base64')); // Decode from base64
};

const hmacSign = async (key: CryptoKey, data: Uint8Array): Promise<Uint8Array> => {
  const signature = await window.crypto.subtle.sign('HMAC', key, data);
  return new Uint8Array(signature);
};

const hmacVerify = async (key: CryptoKey, data: Uint8Array, signature: Uint8Array): Promise<boolean> => {
  const computedSignature = await hmacSign(key, data);
  return computedSignature.every((value, index) => value === signature[index]);
};

export const encode_jwt = async (secret: string, id: string | number, payload: object, ttl?: number): Promise<string> => {
  const header = {
      alg: 'HS256',
      typ: 'JWT',
  };

  const timestamp = Math.floor(Date.now() / 1000);
  const jwtPayload: JwtPayload = {
      ...payload,
      id,
      iat: timestamp,
  };

  if (ttl) {
      jwtPayload.exp = timestamp + ttl;
  }

  const encodedHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(jwtPayload)));

  const key = await window.crypto.subtle.importKey(
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

export const decode_jwt = async (secret: string, jwt: string): Promise<{ id: string, payload: object, expires_at: Date | null }> => {
  const [encodedHeader, encodedPayload, encodedSignature] = jwt.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) {
      throw new Error('Invalid JWT');
  }

  const key = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: { name: 'SHA-256' } },
      false,
      ['verify']
  );

  const validSignature = await hmacVerify(
      key,
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
      base64UrlDecode(encodedSignature)
  );

  if (!validSignature) {
      throw new Error('Invalid JWT signature');
  }

  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload))) as JwtPayload;
  const expires_at = payload.exp ? new Date(payload.exp * 1000) : null;

  return {
      id: payload.id.toString(),
      payload,
      expires_at,
  };
};

export const validate_jwt = async (secret: string, jwt: string): Promise<boolean> => {
  try {
      const { expires_at } = await decode_jwt(secret, jwt);
      if (expires_at && expires_at < new Date()) {
          return false;
      }
      return true;
  } catch {
      return false;
  }
};
