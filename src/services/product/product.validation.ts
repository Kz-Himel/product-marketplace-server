import { z } from 'zod';
import { ProductStatus } from '@prisma/client';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  image: z.string().optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0').optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
  image: z.string().optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  categoryId: z.string().optional(),
});