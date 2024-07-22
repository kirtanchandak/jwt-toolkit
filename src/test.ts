import { encode_jwt } from "./jwt";

const secret = 'secret';
const payload = { userId: 123, name: 'Amay Chandak' };

// Encode
const token = encode_jwt(secret, 1, payload, 300);
console.log('Encoded Token:', token);