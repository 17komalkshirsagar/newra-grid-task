import { Router } from 'express';
import { submitContact, getContacts, updateContactStatus } from '../controllers/contact.controller';
import { verifyAuth } from '../utils/auth';

const router = Router();


router.post('/submit', submitContact);

router.get('/', verifyAuth, getContacts);
router.patch('/:id/status', verifyAuth, updateContactStatus);

export default router;