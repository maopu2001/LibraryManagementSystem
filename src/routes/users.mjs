import { Router } from "express";
import {
  filterUserInfo,
  getUserInfoByID,
  insertUserInfo,
  patchUserInfo,
  deleteUserInfo,
} from "../functions/users.mjs";

const router = Router();

router.get("/api/users", async (req, res) => filterUserInfo(req, res));

router.get("/api/users/:id", async (req, res) => getUserInfoByID(req, res));

router.post("/api/users", async (req, res) => insertUserInfo(req, res));

router.patch("/api/users/:regId", async (req, res) => patchUserInfo(req, res));

router.delete("/api/users/:id", async (req, res) => deleteUserInfo(req, res));

export default router;
