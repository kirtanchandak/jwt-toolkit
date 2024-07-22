"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode_jwt = void 0;
const crypto_1 = require("crypto");
const base64UrlEncode = (str) => {
    return Buffer.from(str).toString('base64url');
};
const createJwtSignature = (header, payload, secret) => {
    return (0, crypto_1.createHmac)('SHA256', secret).update(`${header}.${payload}`).digest('base64url');
};
const encode_jwt = (secret, id, payload, ttl) => {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };
    const timestamp = Math.floor(Date.now() / 1000);
    const jwtPayload = Object.assign(Object.assign({}, payload), { id, iat: timestamp });
    if (ttl) {
        jwtPayload.exp = timestamp + ttl;
    }
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload));
    const signature = createJwtSignature(encodedHeader, encodedPayload, secret);
    return `${encodedHeader}.${encodedPayload}.${signature}`;
};
exports.encode_jwt = encode_jwt;
