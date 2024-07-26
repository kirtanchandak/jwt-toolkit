import { encode_jwt } from "./encodeJwt";
import { decode_jwt } from "./decodeJwt";
import { validate_jwt } from "./validateJwt";

const generateToken = async (): Promise<void> => {
  const secret = 'secret';
  const payload = { userId: 123, name: 'Anish' };
  const options = {ttl: 3600, aud: "my-aud", iss: "sallubhai"}

  try {
    const token = await encode_jwt(secret, 1, payload, options);
    console.log('Encoded Token:', token);
  } catch (error) {
    console.error('Error encoding JWT:', error);
  }
};

const decodeToken = async (): Promise<void> => {
  const secret = 'secret';
  try {
    const signature = await decode_jwt(secret, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywibmFtZSI6IkFuaXNoIiwiaWQiOjEsImlhdCI6MTcyMTk3Nzc4MiwiZXhwIjoxNzIxOTgxMzgyLCJhdWQiOiJteS1hdWQiLCJpc3MiOiJzYWxsdWJoYWkifQ.V_fObnQaZWMj9nRnoT06jITZ9-oRnUonxBxFvbpSE4o")
    console.log(signature);
  } catch (err) {
    console.log(err);
  }
}

const validateToken = async (): Promise<void> => {
  const secret = 'secret';
  try {
    const signature = await validate_jwt(secret, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywibmFtZSI6IkFuaXNoIiwiaWQiOjEsImlhdCI6MTcyMTk3Nzc4MiwiZXhwIjoxNzIxOTgxMzgyLCJhdWQiOiJteS1hdWQiLCJpc3MiOiJzYWxsdWJoYWkifQ.V_fObnQaZWMj9nRnoT06jITZ9-oRnUonxBxFvbpSE4o")
    console.log(signature);
  } catch (err) {
    console.log(err);
  }
}

generateToken();
decodeToken();
validateToken();