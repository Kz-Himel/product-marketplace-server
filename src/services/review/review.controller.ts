import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import { ReviewService } from './review.service';
import { sendSuccess } from '../../utils/response';

export class ReviewController {
  // ==========================================
  // Create Review
  // ==========================================
  static async createReview(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.userId;

      const review = await ReviewService.createReview(
        userId,
        req.body
      );

      return sendSuccess(
        res,
        201,
        'Review submitted successfully',
        review
      );
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Get All Reviews
  // ==========================================
  static async getAllReviews(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const reviews = await ReviewService.getAllReviews();

      return sendSuccess(
        res,
        200,
        'Reviews retrieved successfully',
        reviews
      );
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Get Review By ID
  // ==========================================
  static async getReviewById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const review = await ReviewService.getReviewById(
        req.params.id as string
      );

      return sendSuccess(
        res,
        200,
        'Review retrieved successfully',
        review
      );
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Update Review
  // ==========================================
  static async updateReview(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;

      const review = await ReviewService.updateReview(
        req.params.id as string,
        userId,
        role,
        req.body
      );

      return sendSuccess(
        res,
        200,
        'Review updated successfully',
        review
      );
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Delete Review
  // ==========================================
  static async deleteReview(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;

      const review = await ReviewService.deleteReview(
        req.params.id as string,
        userId,
        role
      );

      return sendSuccess(
        res,
        200,
        'Review deleted successfully (soft delete)',
        review
      );
    } catch (error) {
      next(error);
    }
  }
}