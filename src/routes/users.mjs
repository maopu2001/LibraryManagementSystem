import { Router } from "express";
import {
  filterUserInfo,
  getUserInfoByID,
  insertUserInfo,
  patchUserInfo,
  deleteUserInfo,
} from "../controller/users.mjs";

const router = Router();

router.get("/users", async (req, res) => filterUserInfo(req, res));

router.get("users/:id", async (req, res) => getUserInfoByID(req, res));

router.post("/users", async (req, res) => insertUserInfo(req, res));

router.patch("/users/:regId", async (req, res) => patchUserInfo(req, res));

router.delete("/users/:id", async (req, res) => deleteUserInfo(req, res));

export default router;
