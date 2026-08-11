import { Router } from 'express';
import { ReviewController } from '../services/review/review.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes (anyone can fetch reviews)
router.get('/', ReviewController.getAllReviews);
router.get('/:id', ReviewController.getReviewById);

// Protected routes (login required)
router.post('/', authenticate, ReviewController.createReview);
router.patch('/:id', authenticate, ReviewController.updateReview);
router.delete('/:id', authenticate, ReviewController.deleteReview);

export default router;