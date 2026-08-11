import { Router } from 'express';
import { ProductController } from '../services/product/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// Public routes (anyone can view products)
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

// Protected Admin-only routes
router.post('/', authenticate, authorize(UserRole.ADMIN), ProductController.createProduct);
router.patch('/:id', authenticate, authorize(UserRole.ADMIN), ProductController.updateProduct);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), ProductController.deleteProduct);

export default router;