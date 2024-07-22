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


