import { encode_jwt, decode_jwt } from "./jwt";

const secret = 'secret';
const payload = { userId: 123, name: 'Anish' };

// Encode
const token = encode_jwt(secret, 1, payload, 300);
console.log('Encoded Token:', token);

//decode
const decoded = decode_jwt(secret, token);
console.log('Decoded Token:', decoded);