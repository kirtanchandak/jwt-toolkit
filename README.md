# jwt-toolkit-fast
`jwt-toolkit-fast` ✨ is a JavaScript module for JSON Object Signing and Encryption, providing support for JSON Web Tokens (JWT). The module is designed to work across various Web-interoperable runtimes including Node.js and browsers.
# Documentation
The `jwt-toolkit-fast` module supports JSON Web Tokens (JWT) and provides functionality for signing and verifying tokens. 
### Encode/Sign JWT
Creates a JWT using the given payload.
```javascript
import { encode_jwt } from "jwt-toolkit-fast";

const generateToken = async (): Promise<void> => {
  const secret = 'secret';
  const payload = { userId: 123, name: 'Anish' };
  const options = {ttl: 3600, aud: "my-aud", iss: "laptop"}

  try {
    const token = await encode_jwt(secret, 1, payload, options);
    console.log('Encoded Token:', token);
  } catch (error) {
    console.error('Error encoding JWT:', error);
  }
};
```
`aud` and `iss` are optional parameters passed in options.
### Decode JWT
Decodes a JWT and returns the payload.
```javascript
import { decode_jwt } from "jwt-toolkit-fast";

const decodeToken = async (): Promise<void> => {
  const secret = 'secret';
  try {
    const signature = await decode_jwt(secret, token)
    console.log(signature);
  } catch (err) {
    console.log(err);
  }
}
```
### Validate JWT
Validates a JWT, if a JWT token is expired then it returns `false` otherwise returns `true`
```javascript
import { validate_jwt } from "jwt-toolkit-fast";

const validateToken = async (): Promise<void> => {
  const secret = 'secret';
  try {
    const signature = await validate_jwt(secret, token)
    console.log(signature);
  } catch (err) {
    console.log(err);
  }
}
```
## Installation

```bash
  git clone https://github.com/kirtanchandak/jwt-toolkit-fast
  cd jwt-toolkit-fast
```

Installing dependencies 
```bash
  npm install
```
Compile `typescipt` files
```bash
  cd src
  npx tsc
```
# Testing
I have added two methods to the test.
### Manual testing
Via console logging JWT and decoded JWT
```bash
  cd dist 
  node manualTest.js
```
### Jest testing
```bash
 npm test
```
## Authors

- [@kirtanchandak](https://www.github.com/kirtanchandak)

# Conclusion
happy hacking:) 🚀


