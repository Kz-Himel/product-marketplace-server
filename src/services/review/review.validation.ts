import { z } from 'zod';
import { ReviewStatus } from '@prisma/client';

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(1, 'Comment is required'),
  productId: z.string().min(1, 'Product ID is required'),
  status: z.nativeEnum(ReviewStatus).optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional(),
  comment: z.string().min(1, 'Comment is required').optional(),
  status: z.nativeEnum(ReviewStatus).optional(),
});