import { Router } from "express";
import {
  changeBookSlotLimit,
  issueBook,
  returnBook,
} from "../functions/admin.mjs";
import { createAccount } from "../functions/auths.mjs";
import { createUser } from "../functions/users.mjs";

const router = Router();

router.post("/api/admin/bookLimit", async (req, res) =>
  changeBookSlotLimit(req, res)
);

router.patch("/api/admin/bookIssue/:id", async (req, res) =>
  issueBook(req, res)
);

router.patch("/api/admin/bookReturn/:id", async (req, res) =>
  returnBook(req, res)
);

createAccount("zeroOrOne", "zeroorone", "masteradmin");
const body = {
  regId: "zeroOrOne",
  name: "Master Administration",
  session: "null",
  dept: "null",
  batch: 0,
};
createUser(body);

export default router;
