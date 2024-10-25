import userTable from '../schemas/users.mjs';
import bookTable from '../schemas/books.mjs';

let SLOT_LIMIT = 3;

export const changeBookSlotLimit = async (req, res) => {
  SLOT_LIMIT = req.body.limit;
  res.status(200).json({ message: 'Book limit updated' });
};

export const issueBook = async (req, res) => {
  const bookArray = req.body.bookList;
  const { id } = req.params;

  try {
    // checking if this user exists
    if (!(await userTable.exists({ regId: id }))) {
      return res.status(404).json({ message: 'User not found' });
    }
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
      if ((await userTable.findOne({ regId: id })).bookList.length > SLOT_LIMIT) {
        return res.status(400).json({ message: "User doesn't have any book slot remaining" });
      }

      // issuing book
      await userTable.updateOne({ regId: id }, { $push: { bookList: ISBN } });
      await bookTable.updateOne({ ISBN: ISBN }, { $inc: { qty: -1 } });
      console.log({ message: `Book with ISBN: ${ISBN} issued ` });
    }
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).json({ message: err.message || err || 'Something went wrong.' });
  }
};

//Returning book
export const returnBook = async (req, res) => {
  const bookArray = req.body.bookList;
  const { id } = req.params;

  try {
    // checking if the user exists
    if (!(await userTable.exists({ regId: id }))) {
      return res.status(404).json({ message: 'User not found' });
    }
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
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).json({ message: err.message || err || 'Something went wrong.' });
  }
};
