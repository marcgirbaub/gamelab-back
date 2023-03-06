import { type JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
  username: string;
  id: string;
}
