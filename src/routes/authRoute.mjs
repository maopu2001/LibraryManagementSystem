import express from "express";
import bcrypt from "bcrypt";
import authTable from "../schemas/authSchema.mjs";
import jwt from "jsonwebtoken";

const SALT_ROUND = 10;

const router = express.Router();

const jwtTokenGenerator = (user) => {
  const payload = {
    username: user.username,
    password: user.password,
    updatedAt: user.updatedAt,
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const jwtTokenVerifier = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return null;
  }
};

// verify session cookie
router.get("/api/authverify", async (req, res) => {
  try {
    const token = req.headers.cookie.split("token=").at(1);
    if (jwtTokenVerifier(token))
      res.status(200).json({ message: "Token matched" });
    else res.status(400).json({ message: "Wrong token" });
  } catch (err) {
    return res.redirect("/");
  }
});

// login
router.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (await authTable.exists({ username: username })) {
      const user = await authTable.findOne({ username: username }, "-_id -__v");
      console.log(user);
      if (bcrypt.compareSync(password, user.password)) {
        res.cookie("token", jwtTokenGenerator(user));
        return res.status(200).json({ message: "Sucess", user });
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

//logout
router.delete("/api/logout", async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout Success" });
});

// create new user account
router.post("/api/register", async (req, res) => {
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

// forget password
router.patch("/api/register/:id", async (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  if (body.password.length > 16) {
    return res.status(400).json({ Error: "Password is too long" });
  }
  try {
    const hashedPassword = bcrypt.hashSync(body.password, SALT_ROUND);
    const newUser = await authTable.updateOne(
      { username: id },
      { password: hashedPassword }
    );
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
});

export default router;
