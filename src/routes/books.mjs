import { Router } from "express";
import {
  filterBookInfo,
  getBookInfoByID,
  insertBookInfo,
  patchBookInfo,
  deleteBookInfo,
} from "../functions/books.mjs";

const router = Router();

router.get("/api/books", async (req, res) => filterBookInfo(req, res));

router.get("/api/books/:id", async (req, res) => getBookInfoByID(req, res));

router.post("/api/books", async (req, res) => insertBookInfo(req, res));

router.patch("/api/books/:id", async (req, res) => patchBookInfo(req, res));

router.delete("/api/books/:id", async (req, res) => deleteBookInfo(req, res));

export default router;
