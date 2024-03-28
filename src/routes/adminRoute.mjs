import express from "express";
import userTable from "../schemas/userSchema.mjs";
import bookTable from "../schemas/bookSchema.mjs";

const router = express.Router();

let SLOT_LIMIT = 3;

router.post("/api/admin/bookLimit", async (req, res) => {
  SLOT_LIMIT = req.body.limit;
  res.status(200).json({ message: "Book limit updated" });
});

// Issuing book
router.patch("/api/admin/bookIssue/:id", async (req, res) => {
  const bookArray = req.body.bookList;
  const { id } = req.params;
  // checking if this user exists
  if (!(await userTable.exists({ regId: id }))) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    for (let ISBN of bookArray) {
      // checking if the book exists
      if (!(await bookTable.exists({ ISBN: ISBN }))) {
        console.log({ message: `ISBN: ${ISBN}, Book is not found ` });
        continue;
      }

      //checking if the book has been possessed by this user already
      let books = await userTable.findOne({ regId: id });
      let possessed = false;
      for (let book of books.bookList) {
        if (book == ISBN) {
          possessed = true;
          break;
        }
      }
      if (possessed) {
        console.log({
          message: `ISBN: ${ISBN}, Book is alrdy in the possession of this user `,
        });
        continue;
      }

      // checking if any books remains to issue
      let remainingBooks = await bookTable.findOne({ ISBN: ISBN });
      if (remainingBooks.qty <= 0) {
        console.log({ message: `ISBN: ${ISBN}, Book is not available now ` });
        continue;
      }

      //checking if the user has any slot remaining
      if (
        (await userTable.findOne({ regId: id })).bookList.length > SLOT_LIMIT
      ) {
        return res
          .status(400)
          .json({ message: "User doesn't have any book slot remaining" });
      }

      // issuing book
      await userTable.updateOne({ regId: id }, { $push: { bookList: ISBN } });
      await bookTable.updateOne({ ISBN: ISBN }, { $inc: { qty: -1 } });
      console.log({ message: `Book with ISBN: ${ISBN} issued ` });
    }
    return res.sendStatus(200);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

//Returning book
router.patch("/api/admin/bookReturn/:id", async (req, res) => {
  const bookArray = req.body.bookList;
  const { id } = req.params;

  // checking if the user exists
  if (!(await userTable.exists({ regId: id }))) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    for (let ISBN of bookArray) {
      // checking if the book exists
      if (!(await bookTable.exists({ ISBN: ISBN }))) {
        console.log({ message: `ISBN: ${ISBN}, Book is not found ` });
        continue;
      }
      // checking if the book is in possession of this user
      let books = await userTable.findOne({ regId: id });
      let possessed = false;
      for (let book of books.bookList) {
        if (book == ISBN) {
          possessed = true;
          break;
        }
      }
      if (!possessed) {
        console.log({
          message: `ISBN: ${ISBN}, Book is not in this users possession `,
        });
        continue;
      }

      // returning book
      await userTable.updateOne({ regId: id }, { $pull: { bookList: ISBN } });
      await bookTable.updateOne({ ISBN: ISBN }, { $inc: { qty: 1 } });
      console.log({ message: `Book with ISBN: ${ISBN} returned` });
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
