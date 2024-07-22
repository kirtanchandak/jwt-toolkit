import { encode_jwt, decode_jwt, validate_jwt } from "./jwt";

const secret = 'secret';
const payload = { userId: 123, name: 'Anish' };

// Encode
const token = encode_jwt(secret, 1, payload, 3000);
console.log('Encoded Token:', token);

//decode
const decoded = decode_jwt(secret, token);
console.log('Decoded Token:', decoded);

// Validate
const isValid = validate_jwt(secret, token);
console.log('Is Token Valid:', isValid);

// Test expiration
setTimeout(() => {
  const isExpired = validate_jwt(secret, token);
  console.log('Is Token Valid after 2 seconds:', isExpired);
}, 2000);