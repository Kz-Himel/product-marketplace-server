import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../utils/response';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      return sendSuccess(res, 201, 'User registered successfully', user);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return sendSuccess(res, 200, 'User logged in successfully', result);
    } catch (error) {
      next(error);
    }
  }
}