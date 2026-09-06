import { Router } from 'express';
import {
  adminGetUsers,
  adminGetUser,
  adminUpdateUser,
  adminCreateUser,
  adminDeleteUser,
  adminToggleBlock,
  adminUserStats,
} from '../controllers/adminUser.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createStaffSchema, updateUserSchema } from '@toys/validation';

const router: Router = Router();

router.use(authenticate, authorize('admin', 'manager'));

router.get('/stats/summary', adminUserStats);
router.get('/', adminGetUsers);
router.post('/', validate(createStaffSchema), adminCreateUser);
router.get('/:id', adminGetUser);
router.put('/:id', validate(updateUserSchema.partial()), adminUpdateUser);
router.put('/:id/block', adminToggleBlock);
router.delete('/:id', adminDeleteUser);

export default router;
