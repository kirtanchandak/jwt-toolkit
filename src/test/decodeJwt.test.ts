import { encode_jwt } from '../encodeJwt'; // Adjust the import path accordingly
import { decode_jwt } from '../decodeJwt'; // Adjust the import path accordingly

describe('decode_jwt', () => {
  it('should decode a valid JWT', async () => {
    const secret = 'mysecret';
    const id = 12345;
    const payload = { name: 'John Doe', role: 'admin' };
    const options = { ttl: 3600, aud: 'myapp', iss: 'myissuer' };

    const jwt = await encode_jwt(secret, id, payload, options);

    const decoded = await decode_jwt(secret, jwt);

    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(id);
    expect(decoded.payload).toMatchObject({
      name: 'John Doe',
      role: 'admin',
      id,
      aud: 'myapp',
      iss: 'myissuer'
    });

    expect(decoded.expires_at).toBeDefined();
    if (decoded.expires_at) {
      const expectedExp = Math.floor(Date.now() / 1000) + options.ttl;
      expect(decoded.expires_at.getTime() / 1000).toBeCloseTo(expectedExp, -1);
    }
  });

  it('should throw an error for invalid JWT format', async () => {
    const secret = 'mysecret';
    const invalidJwt = 'invalid.jwt.token';

    await expect(decode_jwt(secret, invalidJwt)).rejects.toThrow('Invalid JWT format');
  });

  it('should throw an error for invalid JWT header format', async () => {
    const secret = 'mysecret';
    const invalidJwt = 'eyJhbGciOiAiSFMyNTYifQ.invalidpayload.invalidsignature';

    await expect(decode_jwt(secret, invalidJwt)).rejects.toThrow('Invalid JWT header format');
  });

  it('should throw an error for invalid JWT payload format', async () => {
    const secret = 'mysecret';
    const invalidJwt = 'eyJhbGciOiAiSFMyNTYifQ.eyJleHAiOiAifQ.invalidsignature';

    await expect(decode_jwt(secret, invalidJwt)).rejects.toThrow('Invalid JWT payload format');
  });

  it('should throw an error for invalid signature', async () => {
    const secret = 'mysecret';
    const id = 12345;
    const payload = { name: 'John Doe', role: 'admin' };
    const options = { ttl: 3600, aud: 'myapp', iss: 'myissuer' };

    const jwt = await encode_jwt(secret, id, payload, options);

    const parts = jwt.split('.');
    const invalidJwt = `${parts[0]}.${parts[1]}.invalidsignature`;

    await expect(decode_jwt(secret, invalidJwt)).rejects.toThrow('Invalid signature');
  });
});

// Helper function to decode base64url to base64
function atob(base64url: string): string {
  return Buffer.from(base64url, 'base64').toString('binary');
}


