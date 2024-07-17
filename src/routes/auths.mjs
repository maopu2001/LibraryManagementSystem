import { Router } from "express";
import {
  sessionVerifier,
  sessionLogin,
  sessionLogout,
  register,
  forgotPass,
} from "../controller/auths.mjs";

const router = Router();

// verify session cookie
router.post("/authverify", async (req, res) => sessionVerifier(req, res));

// login
router.post("/login", async (req, res) => sessionLogin(req, res));

//logout
router.delete("/logout", async (req, res) => sessionLogout(req, res));

// create new user account
router.post("/register", async (req, res) => register(req, res));

// forget password
router.patch("/register/:id", async (req, res) => forgotPass(req, res));

export default router;
