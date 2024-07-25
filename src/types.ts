export interface JwtPayload {
    [key: string]: any;
    id: string | number;
    iat: number;
    exp?: number;
  }
  
export interface JwtHeader {
    alg: string;
    typ: string;
  }
  