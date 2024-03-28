import express from "express";
import bookTable from "../schemas/bookSchema.mjs";

const router = express.Router();

router.get("/api/books", async (req, res) => {
  const {
    query: { filter, value },
  } = req;

  try {
    if (!filter && !value) {
      const Books = await bookTable.find({}, "-_id -__v").sort({ ISBN: 1 });
      return res.status(200).json(Books);
    }
    if (filter === "ISBN") {
      return res.status(400).json("ISBN can't be used as filter");
    }

    if (filter && value) {
      const Books = await bookTable
        .find(
          {
            [filter]: { $regex: value, $options: "i" },
          },
          "-_id -__v"
        )
        .sort({ ISBN: 1 });
      return res.status(201).json(Books);
    } else {
      return res.sendStatus(400);
    }
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
});

router.get("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (await bookTable.exists({ ISBN: id })) {
      const Books = await bookTable.find({ ISBN: id }, "-_id -__v");
      return res.status(200).json(Books);
    } else {
      return res.sendStatus(404);
    }
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
});

//POST
router.post("/api/books", async (req, res) => {
  const { body } = req;
  try {
    const newBook = await bookTable.create(body);
    return res.status(200).json(newBook);
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
});

//PATCH
router.patch("/api/books/:id", async (req, res) => {
  const { body } = req;
  const { id } = req.params;

  if (body.shelfLoc && !body.shelfLoc.shelfNo)
    return res.status(400).json({ message: "Shelf Number is required" });
  if (body.shelfLoc && !body.shelfLoc.shelveNo)
    return res.status(400).json({ message: "Shelve Number is required" });

  try {
    if (await bookTable.exists({ ISBN: id })) {
      const updatedBook = await bookTable.updateOne(
        { ISBN: id },
        { $set: body }
      );
      return res.status(200).send(updatedBook);
    } else {
      return res.status(400).json({ message: "Book not found" });
    }
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
});

//Delete
router.delete("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (await bookTable.exists({ ISBN: id })) {
      await bookTable.deleteOne({ ISBN: id });
      const Books = await bookTable.find({}, "-_id -__v").sort({ ISBN: 1 });
      return res.status(200).json(Books);
    } else {
      return res.status(400).json({ message: "Book not found" });
    }
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
});

export default router;
