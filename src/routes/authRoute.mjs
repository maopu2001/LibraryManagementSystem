import express from "express";
import bcrypt from "bcrypt";
import authTable from "../schemas/authSchema.mjs";

const SALT_ROUND = 10;

const router = express.Router();

router.get("/api/auth", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (await authTable.exists({ username: username })) {
      const user = await authTable.findOne({ username: username }, "-_id -__v");
      console.log(password);
      console.log(user.password);
      if (bcrypt.compareSync(password, user.password)) {
        return res.status(200).json({ message: "Success" });
      } else {
        return res.status(400).json({ message: "Not Matched" });
      }
    } else {
      return res.status(404).json({ message: "User Not Found" });
    }
  } catch (err) {
    return res.sendStatus(400);
  }
});

router.post("/api/auth", async (req, res) => {
  const { body } = req;
  if (body.password.length > 16) {
    return res.status(400).json({ Error: "Password is too long" });
  }
  try {
    const hashedPassword = bcrypt.hashSync(body.password, SALT_ROUND);
    const data = {
      username: body.username,
      password: hashedPassword,
    };
    const newUser = await authTable.create(data);
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
});

export default router;
