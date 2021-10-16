import { Router } from 'express';
import webhookController from '../controllers/webhookController'


const router = Router()

router.get('/', webhookController.verify)
router.post('/', webhookController.deliver)

export default router;
