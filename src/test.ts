import { encode_jwt} from "./jwt";

const secret = 'secret';
const payload = { userId: 123, name: 'Anish' };

// Encode
const token = encode_jwt(secret, 1, payload);
console.log('Encoded Token:', token);