import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { createOrderSchema, updateOrderSchema } from './order.validation';
import { UserRole, OrderStatus } from '@prisma/client';

export class OrderService {
  static async createOrder(userId: string, data: z.infer<typeof createOrderSchema>) {
    const validated = createOrderSchema.parse(data);

    // Fetch product to calculate total price & check stock
    const product = await prisma.product.findFirst({
      where: { id: validated.productId, isDeleted: false },
    });

    if (!product) {
      const error: any = new Error('Product not found or unavailable');
      error.statusCode = 404;
      throw error;
    }

    if (product.stock < validated.quantity) {
      const error: any = new Error(`Insufficient stock. Only ${product.stock} items left.`);
      error.statusCode = 400;
      throw error;
    }

    const totalPrice = product.price * validated.quantity;

    // Execute order creation and stock reduction in a transaction
    return await prisma.$transaction(async (tx) => {
      // Deduct product stock
      const updatedProduct = await tx.product.update({
        where: { id: product.id },
        data: {
          stock: product.stock - validated.quantity,
          status: product.stock - validated.quantity === 0 ? 'OUT_OF_STOCK' : product.status,
        },
      });

      // Create order record
      return await tx.order.create({
        data: {
          quantity: validated.quantity,
          totalPrice,
          status: 'PENDING',
          userId,
          productId: validated.productId,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });
  }

  static async getAllOrders(userId: string, userRole: UserRole) {
    // Admins can view all orders, standard users view only their own
    const whereCondition: any = { isDeleted: false };
    if (userRole !== UserRole.ADMIN) {
      whereCondition.userId = userId;
    }

    return await prisma.order.findMany({
      where: whereCondition,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getOrderById(id: string, userId: string, userRole: UserRole) {
    const order = await prisma.order.findFirst({
      where: { id, isDeleted: false },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      const error: any = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (order.userId !== userId && userRole !== UserRole.ADMIN) {
      const error: any = new Error('Forbidden: You cannot access this order');
      error.statusCode = 403;
      throw error;
    }

    return order;
  }

  static async updateOrder(
    id: string,
    userId: string,
    userRole: UserRole,
    data: z.infer<typeof updateOrderSchema>
  ) {
    const validated = updateOrderSchema.parse(data);
    const existingOrder = await OrderService.getOrderById(id, userId, userRole);

    // Non-admin users can only cancel their own PENDING orders
    if (userRole !== UserRole.ADMIN) {
      if (existingOrder.userId !== userId) {
        const error: any = new Error('Forbidden: Cannot update this order');
        error.statusCode = 403;
        throw error;
      }

      if (validated.status && validated.status !== OrderStatus.CANCELLED) {
        const error: any = new Error('Users can only cancel pending orders');
        error.statusCode = 400;
        throw error;
      }
    }

    return await prisma.order.update({
      where: { id },
      data: validated,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static async deleteOrder(id: string) {
    // Soft delete order (Admin only)
    const order = await prisma.order.findFirst({
      where: { id, isDeleted: false },
    });

    if (!order) {
      const error: any = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    return await prisma.order.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}