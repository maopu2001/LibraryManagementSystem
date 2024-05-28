import { Router } from "express";
import {
  sessionVerifier,
  sessionLogin,
  sessionLogout,
  register,
  forgotPass,
} from "../functions/auths.mjs";

const router = Router();

// verify session cookie
router.post("/api/authverify", async (req, res) => sessionVerifier(req, res));

// login
router.post("/api/login", async (req, res) => sessionLogin(req, res));

//logout
router.delete("/api/logout", async (req, res) => sessionLogout(req, res));

// create new user account
router.post("/api/register", async (req, res) => register(req, res));

// forget password
router.patch("/api/register/:id", async (req, res) => forgotPass(req, res));

export default router;
