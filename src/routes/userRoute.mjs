import express from "express";
import userTable from "../schemas/userSchema.mjs";

const router = express.Router();

router.get("/api/users", async (req, res) => {
  const {
    query: { filter, value },
  } = req;

  try {
    if (!filter && !value) {
      const Users = await userTable.find({}, "-_id -__v").sort({ regId: 1 });
      return res.status(200).json(Users);
    }
    if (filter === "regId") {
      return res.status(400).json("regId can't be used as filter");
    }

    if (filter && value) {
      const Users = await userTable
        .find(
          {
            [filter]: { $regex: value, $options: "i" },
          },
          "-_id -__v"
        )
        .sort({ regId: 1 });
      return res.status(201).json(Users);
    } else {
      return res.sendStatus(400);
    }
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
});

router.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (await userTable.exists({ regId: id })) {
      const users = await userTable.find({ regId: id }, "-_id -__v");
      return res.status(200).json(users);
    } else {
      return res.sendStatus(404);
    }
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
});

router.post("/api/users", async (req, res) => {
  const { body } = req;
  try {
    const newUser = await userTable.create(body);
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
});

//Patch
router.patch("/api/users/:regId", async (req, res) => {
  const { body } = req;
  const { regId } = req.params;

  try {
    if (await userTable.exists({ regId: regId })) {
      // console.log(id);
      const updatedUser = await userTable.updateOne(
        { regId: regId },
        { $set: body }
      );
      return res.status(200).send(updatedUser);
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
});

//Delete
router.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (await userTable.exists({ regId: id })) {
      await userTable.deleteOne({ regId: id });
      const Users = await userTable
        .find({}, "-_id -name._id -__v")
        .sort({ regId: 1 });
      return res.status(200).json(Users);
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
});

export default router;
