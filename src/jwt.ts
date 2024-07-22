import { createHmac } from 'crypto';

interface JwtPayload {
  [key: string]: any;
  exp?: number;
  iat?: number;
  id: string | number;
}

const base64UrlEncode = (str: string): string => {
  return Buffer.from(str).toString('base64url');
};

const base64UrlDecode = (str: string): string => {
    return Buffer.from(str, 'base64url').toString();
  };

const createJwtSignature = (header: string, payload: string, secret: string): string => {
  return createHmac('SHA256', secret).update(`${header}.${payload}`).digest('base64url');
};

export const encode_jwt = (secret: string, id: string | number, payload: object, ttl?: number): string => {
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

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload));
  const signature = createJwtSignature(encodedHeader, encodedPayload, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const decode_jwt = (secret: string, jwt: string): { id: string, payload: object, expires_at: Date | null } => {
    const [encodedHeader, encodedPayload, signature] = jwt.split('.');
    if (!encodedHeader || !encodedPayload || !signature) {
      throw new Error('Invalid JWT');
    }
  
    const validSignature = createJwtSignature(encodedHeader, encodedPayload, secret);
    if (signature !== validSignature) {
      throw new Error('Invalid JWT signature');
    }
  
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
    const expires_at = payload.exp ? new Date(payload.exp * 1000) : null;
  
    return {
      id: payload.id.toString(),
      payload,
      expires_at,
    };
};

export const validate_jwt = (secret: string, jwt: string): boolean => {
    try {
      const { expires_at } = decode_jwt(secret, jwt);
      if (expires_at && expires_at < new Date()) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };