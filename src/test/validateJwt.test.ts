import { encode_jwt } from '../encodeJwt'; 
import { validate_jwt } from '../validateJwt'; 

describe('validate_jwt', () => {
  it('should return true for a valid JWT', async () => {
    const secret = 'mysecret';
    const id = 12345;
    const payload = { name: 'John Doe', role: 'admin' };
    const options = { ttl: 3600, aud: 'myapp', iss: 'myissuer' };

    const jwt = await encode_jwt(secret, id, payload, options);

    const isValid = await validate_jwt(secret, jwt);

    expect(isValid).toBe(true);
  });

  it('should return false for an expired JWT', async () => {
    const secret = 'mysecret';
    const id = 12345;
    const payload = { name: 'John Doe', role: 'admin' };
    const options = { ttl: -3600, aud: 'myapp', iss: 'myissuer' }; 

    const jwt = await encode_jwt(secret, id, payload, options);

    const isValid = await validate_jwt(secret, jwt);

    expect(isValid).toBe(false);
  });

  it('should return false for an invalid JWT format', async () => {
    const secret = 'mysecret';
    const invalidJwt = 'invalid.jwt.token';

    const isValid = await validate_jwt(secret, invalidJwt);

    expect(isValid).toBe(false);
  });

  it('should return false for an invalid JWT signature', async () => {
    const secret = 'mysecret';
    const id = 12345;
    const payload = { name: 'John Doe', role: 'admin' };
    const options = { ttl: 3600, aud: 'myapp', iss: 'myissuer' };

    const jwt = await encode_jwt(secret, id, payload, options);

    const parts = jwt.split('.');
    const invalidJwt = `${parts[0]}.${parts[1]}.invalidsignature`;

    const isValid = await validate_jwt(secret, invalidJwt);

    expect(isValid).toBe(false);
  });
});


function atob(base64url: string): string {
  return Buffer.from(base64url, 'base64').toString('binary');
}
