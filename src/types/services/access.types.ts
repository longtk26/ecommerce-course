import { JwtPayload } from "jsonwebtoken";
import { FlattenMaps } from "mongoose";

export interface SignUpTypes {
  email: string;
  name: string;
  password: string;
}

export interface SignInTypes {
  email: string;
  password: string;
  refreshToken: string | null;
}

export interface HandleRefreshTokenTypes {
  refreshToken: string;
  user: JwtPayload;
  keyStore: FlattenMaps<any>;
}
