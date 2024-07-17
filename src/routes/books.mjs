import { Router } from "express";
import {
  filterBookInfo,
  getBookInfoByID,
  insertBookInfo,
  patchBookInfo,
  deleteBookInfo,
} from "../controller/books.mjs";

const router = Router();

router.get("/books", async (req, res) => filterBookInfo(req, res));

router.get("/books/:id", async (req, res) => getBookInfoByID(req, res));

router.post("/books", async (req, res) => insertBookInfo(req, res));

router.patch("/books/:id", async (req, res) => patchBookInfo(req, res));

router.delete("/books/:id", async (req, res) => deleteBookInfo(req, res));

export default router;
