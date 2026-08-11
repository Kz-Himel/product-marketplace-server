import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../types';

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as any,
  };
  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};