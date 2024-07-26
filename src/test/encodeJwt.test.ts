import { encode_jwt } from "../encodeJwt";

describe('encode_jwt', () => {
  it('should generate a valid JWT', async () => {
    const secret = 'mysecret';
    const id = 12345;
    const payload = { name: 'John Doe', role: 'admin' };
    const options = { ttl: 3600, aud: 'myapp', iss: 'myissuer' };

    const jwt = await encode_jwt(secret, id, payload, options);

    expect(jwt).toBeDefined();
    expect(typeof jwt).toBe('string');

    const parts = jwt.split('.');
    expect(parts.length).toBe(3);

    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    const header = JSON.parse(atob(encodedHeader.replace(/-/g, '+').replace(/_/g, '/')));
    expect(header).toEqual({ alg: 'HS256', typ: 'JWT' });

    const jwtPayload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')));
    expect(jwtPayload).toMatchObject({
      name: 'John Doe',
      role: 'admin',
      id,
      aud: 'myapp',
      iss: 'myissuer'
    });
    expect(jwtPayload.iat).toBeDefined();
    expect(jwtPayload.exp).toBe(jwtPayload.iat + options.ttl);
  });
});

function atob(base64url: string): string {
  return Buffer.from(base64url, 'base64').toString('binary');
}
