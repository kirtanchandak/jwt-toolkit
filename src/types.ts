export interface JwtPayload {
    [key: string]: any;
    id: string | number;
    iat: number;
    exp?: number;
    aud?: string,
    iss?: string,
  }
  
export interface JwtHeader {
    alg: string;
    typ: string;
  }
  