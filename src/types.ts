import { type JwtPayload } from "jsonwebtoken";
import type * as core from "express-serve-static-core";
import { type Request } from "express";

export interface CustomJwtPayload extends JwtPayload {
  username: string;
  id: string;
}

export interface CustomRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  id: string;
}
