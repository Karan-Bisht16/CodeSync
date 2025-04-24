import { Router } from 'express';
// importing controllers
import { executeCode, formatCode } from '../controllers/codeOperation.controller.js';

const router = Router();

router.post('/executeCode', executeCode);
router.post('/formatCode', formatCode);

export default router;