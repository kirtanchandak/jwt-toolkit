import { decode_jwt, encode_jwt } from "./jwt";

const generateToken = async (): Promise<void> => {
  const secret = 'secret';
  const payload = { userId: 123, name: 'Anish' };

  try {
    const token = await encode_jwt(secret, 1, payload, 3600);
    console.log('Encoded Token:', token);
  } catch (error) {
    console.error('Error encoding JWT:', error);
  }
};

const validateToken = async (): Promise<void> => {
  const secret = 'secret';
  try {
    const signature = await decode_jwt(secret, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywibmFtZSI6IkFuaXNoIiwiaWQiOjEsImlhdCI6MTcyMTgyOTc0MCwiZXhwIjoxNzIxODMzMzQwfQ.2MjnRblca8QfGkQteMbBgjERAhpcLWm1is-zVf3bBgU")
    console.log(signature);
  } catch (err) {
    console.log(err);
  }
}

generateToken();
validateToken();