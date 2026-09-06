import { Router } from 'express';
import {
  getPublicSettings,
  getAllSettings,
  getSetting,
  updateSetting,
  updateSettingsBulk,
} from '../controllers/setting.controller';
import { authenticate, authorize } from '../middleware/auth';

const router: Router = Router();

router.get('/public', getPublicSettings);

router.use(authenticate, authorize('admin', 'manager'));

router.get('/', getAllSettings);
router.put('/', updateSettingsBulk);
router.get('/:key', getSetting);
router.put('/:key', updateSetting);

export default router;
