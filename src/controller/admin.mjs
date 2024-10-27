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
    const user = await userTable.findOne({ regId: id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let notFoundBooks = [];
    let alreadyIssuedBooks = [];
    let notAvailableBooks = [];
    let issuedBooks = [];

    //checking if the user has any slot remaining
    const remainingSlots = SLOT_LIMIT - user.bookList.length;
    if (remainingSlots < bookArray.length)
      return res.status(400).json({
        message: `User doesn't have any book slot remaining. Remaining slots: ${remainingSlots}`,
      });

    for (let ISBN of bookArray) {
      // checking if the book exists
      const book = await bookTable.findOne({ ISBN: ISBN });
      if (!book) {
        notFoundBooks.push(ISBN);
        continue;
      }

      //checking if the book has been possessed by this user already
      let possessed = false;
      for (let possessedBook of user.bookList) {
        if (possessedBook == ISBN) {
          possessed = true;
          break;
        }
      }

      if (possessed) {
        alreadyIssuedBooks.push(ISBN);
        continue;
      }

      // checking if any books remains to issue
      if (book.qty <= 0) {
        notAvailableBooks.push(ISBN);
        continue;
      }

      // issuing book
      await userTable.updateOne({ regId: id }, { $push: { bookList: ISBN } });
      await bookTable.updateOne({ ISBN: ISBN }, { $inc: { qty: -1 } });
      issuedBooks.push(ISBN);
    }
    return res.status(200).json({
      issued: issuedBooks,
      notFound: notFoundBooks,
      notAvailable: notAvailableBooks,
      alreadyIssued: alreadyIssuedBooks,
    });
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
    let notFoundBooks = [];
    let notPossessedBooks = [];
    let returnedBooks = [];

    for (let ISBN of bookArray) {
      // checking if the book exists
      if (!(await bookTable.exists({ ISBN: ISBN }))) {
        notFoundBooks.push(ISBN);
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
        notPossessedBooks.push(ISBN);
        continue;
      }

      // returning book
      await userTable.updateOne({ regId: id }, { $pull: { bookList: ISBN } });
      await bookTable.updateOne({ ISBN: ISBN }, { $inc: { qty: 1 } });
      returnedBooks.push(ISBN);
    }
    return res.status(200).json({ returned: returnedBooks, notFound: notFoundBooks, notPossessed: notPossessedBooks });
  } catch (err) {
    return res.status(500).json({ message: err.message || err || 'Something went wrong.' });
  }
};
