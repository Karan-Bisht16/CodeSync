import { Router } from 'express';
// importng controllers
import { healthCheck } from '../controllers/root.controller.js';

const router = Router();

router.get('/', healthCheck);

export default router;