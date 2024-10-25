import { Router } from 'express';
import users from './users.mjs';
import books from './books.mjs';
import admin from './admin.mjs';
import auths from './auths.mjs';

const router = Router();

router.use(auths);
router.use(users);
router.use(books);
router.use(admin);

export default router;
