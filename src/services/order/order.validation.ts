import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const createOrderSchema = z.object({
  quantity: z.number().int().positive('Quantity must be at least 1'),
  productId: z.string().min(1, 'Product ID is required'),
});

export const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  quantity: z.number().int().positive('Quantity must be at least 1').optional(),
});