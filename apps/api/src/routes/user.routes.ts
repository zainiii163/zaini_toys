import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  addChildProfile,
  getChildProfiles,
  updateChildProfile,
  deleteChildProfile,
  getLoyalty,
  getReferral,
  deleteAccount,
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  updateProfileSchema,
  addressSchema,
  childProfileSchema,
} from '@toys/validation';

const router: Router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);

router.get('/addresses', getAddresses);
router.post('/addresses', validate(addressSchema), addAddress);
router.put('/addresses/:id', validate(addressSchema.partial()), updateAddress);
router.delete('/addresses/:id', deleteAddress);

router.get('/child-profiles', getChildProfiles);
router.post('/child-profiles', validate(childProfileSchema), addChildProfile);
router.put('/child-profiles/:id', validate(childProfileSchema.partial()), updateChildProfile);
router.delete('/child-profiles/:id', deleteChildProfile);

router.get('/loyalty', getLoyalty);
router.get('/referral', getReferral);

router.delete('/account', deleteAccount);

export default router;
