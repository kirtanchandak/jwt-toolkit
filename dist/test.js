"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("./jwt");
const secret = 'secret';
const payload = { userId: 123, name: 'Kirtan Chandak' };
// Encode
const token = (0, jwt_1.encode_jwt)(secret, 1, payload, 300);
console.log('Encoded Token:', token);
