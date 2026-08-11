import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { sendSuccess } from '../../utils/response';

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);
      return sendSuccess(res, 201, 'User created successfully', user);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      return sendSuccess(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return sendSuccess(res, 200, 'User retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      return sendSuccess(res, 200, 'User updated successfully', user);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.deleteUser(req.params.id);
      return sendSuccess(res, 200, 'User deleted successfully (soft delete)', user);
    } catch (error) {
      next(error);
    }
  }
}