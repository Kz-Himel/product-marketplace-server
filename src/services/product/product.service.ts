import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { createProductSchema, updateProductSchema } from './product.validation';

export class ProductService {
  static async createProduct(data: z.infer<typeof createProductSchema>) {
    const validated = createProductSchema.parse(data);

    // Verify category exists and is not soft deleted
    const categoryExists = await prisma.category.findFirst({
      where: { id: validated.categoryId, isDeleted: false },
    });

    if (!categoryExists) {
      const error: any = new Error('Category not found or has been deleted');
      error.statusCode = 404;
      throw error;
    }

    return await prisma.product.create({
      data: {
        name: validated.name,
        description: validated.description ?? '',
        price: validated.price,
        stock: validated.stock,
        image: validated.image,
        status: validated.status || 'ACTIVE',
        categoryId: validated.categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async getAllProducts() {
    return await prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findFirst({
      where: { id, isDeleted: false },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        reviews: {
          where: { isDeleted: false, status: 'PUBLISHED' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      const error: any = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    return product;
  }

  static async updateProduct(id: string, data: z.infer<typeof updateProductSchema>) {
    const validated = updateProductSchema.parse(data);

    await ProductService.getProductById(id);

    if (validated.categoryId) {
      const categoryExists = await prisma.category.findFirst({
        where: { id: validated.categoryId, isDeleted: false },
      });

      if (!categoryExists) {
        const error: any = new Error('Category not found or has been deleted');
        error.statusCode = 404;
        throw error;
      }
    }

    return await prisma.product.update({
      where: { id },
      data: validated,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async deleteProduct(id: string) {
    await ProductService.getProductById(id);

    return await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}