import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { createReviewSchema, updateReviewSchema } from './review.validation';
import { UserRole } from '@prisma/client';

export class ReviewService {
  static async createReview(userId: string, data: z.infer<typeof createReviewSchema>) {
    const validated = createReviewSchema.parse(data);

    // Verify product exists and is active
    const productExists = await prisma.product.findFirst({
      where: { id: validated.productId, isDeleted: false },
    });

    if (!productExists) {
      const error: any = new Error('Product not found or deleted');
      error.statusCode = 404;
      throw error;
    }

    return await prisma.review.create({
      data: {
        rating: validated.rating,
        comment: validated.comment,
        status: validated.status || 'PUBLISHED',
        userId,
        productId: validated.productId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async getAllReviews() {
    return await prisma.review.findMany({
      where: { isDeleted: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getReviewById(id: string) {
    const review = await prisma.review.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!review) {
      const error: any = new Error('Review not found');
      error.statusCode = 404;
      throw error;
    }

    return review;
  }

  static async updateReview(
    id: string,
    userId: string,
    userRole: UserRole,
    data: z.infer<typeof updateReviewSchema>
  ) {
    const validated = updateReviewSchema.parse(data);
    const existingReview = await ReviewService.getReviewById(id);

    // Only review owner or admin can update
    if (existingReview.userId !== userId && userRole !== UserRole.ADMIN) {
      const error: any = new Error('Forbidden: You can only update your own reviews');
      error.statusCode = 403;
      throw error;
    }

    return await prisma.review.update({
      where: { id },
      data: validated,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async deleteReview(id: string, userId: string, userRole: UserRole) {
    const existingReview = await ReviewService.getReviewById(id);

    // Only review owner or admin can delete
    if (existingReview.userId !== userId && userRole !== UserRole.ADMIN) {
      const error: any = new Error('Forbidden: You can only delete your own reviews');
      error.statusCode = 403;
      throw error;
    }

    return await prisma.review.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}