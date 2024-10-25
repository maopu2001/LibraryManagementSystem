import { Router } from 'express';
import { sessionVerifier, sessionLogin, sessionLogout, register, forgotPass } from '../controller/auths.mjs';

const router = Router();

router.post('/authverify', async (req, res) => sessionVerifier(req, res));

router.post('/login', async (req, res) => sessionLogin(req, res));

router.delete('/logout', async (req, res) => sessionLogout(req, res));

router.post('/register', async (req, res) => register(req, res));

router.patch('/register/:id', async (req, res) => forgotPass(req, res));

export default router;
