import { z } from 'zod';
import { CategoryStatus } from '@prisma/client';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  status: z.nativeEnum(CategoryStatus).optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  status: z.nativeEnum(CategoryStatus).optional(),
});