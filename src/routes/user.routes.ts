import { Router } from 'express';
import { UserController } from '../services/user/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// Protect all routes
router.use(authenticate);

router.post('/', authorize(UserRole.ADMIN), UserController.createUser);
router.get('/', authorize(UserRole.ADMIN), UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.patch('/:id', UserController.updateUser);
router.delete('/:id', authorize(UserRole.ADMIN), UserController.deleteUser);

export default router;