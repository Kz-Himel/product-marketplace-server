import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { createCategorySchema, updateCategorySchema } from './category.validation';

export class CategoryService {
  static async createCategory(data: z.infer<typeof createCategorySchema>) {
    const validated = createCategorySchema.parse(data);

    return await prisma.category.create({
      data: {
        name: validated.name,
        description: validated.description,
        status: validated.status || 'ACTIVE',
      },
    });
  }

  static async getAllCategories() {
    return await prisma.category.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCategoryById(id: string) {
    const category = await prisma.category.findFirst({
      where: { id, isDeleted: false },
    });

    if (!category) {
      const error: any = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    return category;
  }

  static async updateCategory(id: string, data: z.infer<typeof updateCategorySchema>) {
    const validated = updateCategorySchema.parse(data);

    await CategoryService.getCategoryById(id);

    return await prisma.category.update({
      where: { id },
      data: validated,
    });
  }

  static async deleteCategory(id: string) {
    await CategoryService.getCategoryById(id);

    return await prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}