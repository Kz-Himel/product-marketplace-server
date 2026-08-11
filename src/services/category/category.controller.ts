import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';
import { sendSuccess } from '../../utils/response';

export class CategoryController {
  // ==========================================
  // Create Category
  // ==========================================
  static async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const category = await CategoryService.createCategory(req.body);

      return sendSuccess(
        res,
        201,
        'Category created successfully',
        category
      );
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Get All Categories
  // ==========================================
  static async getAllCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categories = await CategoryService.getAllCategories();

      return sendSuccess(
        res,
        200,
        'Categories retrieved successfully',
        categories
      );
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Get Category By ID
  // ==========================================
  static async getCategoryById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const category = await CategoryService.getCategoryById(
        req.params.id
      );

      return sendSuccess(
        res,
        200,
        'Category retrieved successfully',
        category
      );
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Update Category
  // ==========================================
  static async updateCategory(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const category = await CategoryService.updateCategory(
        req.params.id,
        req.body
      );

      return sendSuccess(
        res,
        200,
        'Category updated successfully',
        category
      );
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Delete Category
  // ==========================================
  static async deleteCategory(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const category = await CategoryService.deleteCategory(
        req.params.id
      );

      return sendSuccess(
        res,
        200,
        'Category deleted successfully (soft delete)',
        category
      );
    } catch (error) {
      next(error);
    }
  }
}