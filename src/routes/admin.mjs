import { Router } from "express";
import {
  changeBookSlotLimit,
  issueBook,
  returnBook,
} from "../controller/admin.mjs";
import { createAccount } from "../controller/auths.mjs";
import { createUser } from "../controller/users.mjs";

const router = Router();

router.post("/admin/bookLimit", async (req, res) =>
  changeBookSlotLimit(req, res)
);

router.patch("/admin/bookIssue/:id", async (req, res) =>
  issueBook(req, res)
);

router.patch("/admin/bookReturn/:id", async (req, res) =>
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
