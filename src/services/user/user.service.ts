import { prisma } from '../../lib/prisma';
import { hashPassword } from '../../utils/password';
import { z } from 'zod';
import { createUserSchema, updateUserSchema } from './user.validation';

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
};

export class UserService {
  static async createUser(data: z.infer<typeof createUserSchema>) {
    const validated = createUserSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      const error: any = new Error('Email is already registered');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(validated.password);

    return await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: validated.role || 'USER',
      },
      select: userSelect,
    });
  }

  static async getAllUsers() {
    return await prisma.user.findMany({
      where: { isDeleted: false },
      select: userSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, isDeleted: false },
      select: userSelect,
    });

    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  static async updateUser(id: string, data: z.infer<typeof updateUserSchema>) {
    const validated = updateUserSchema.parse(data);

    await UserService.getUserById(id);

    const updateData: any = { ...validated };
    if (validated.password) {
      updateData.password = await hashPassword(validated.password);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: userSelect,
    });
  }

  static async deleteUser(id: string) {
    await UserService.getUserById(id);

    return await prisma.user.update({
      where: { id },
      data: { isDeleted: true },
      select: userSelect,
    });
  }
}