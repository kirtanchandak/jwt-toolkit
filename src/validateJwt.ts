import { decode_jwt } from "./decodeJwt";

export const validate_jwt = async (secret: string, jwt: string): Promise<boolean> => {
    try {
      const { expires_at } = await decode_jwt(secret, jwt);
      if (expires_at && expires_at.getTime() < Date.now()) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };