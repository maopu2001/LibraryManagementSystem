import bcrypt from "bcrypt";
import authTable from "../schemas/auths.mjs";
import jwt from "jsonwebtoken";

const SALT_ROUND = 10;

const jwtTokenGenerator = (user) => {
  const payload = {
    regId: user.regId,
    type: user.type,
    password: user.password,
    updatedAt: user.updatedAt,
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

const jwtTokenVerifier = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return null;
  }
};

const hashPass = (password) => {
  return bcrypt.hashSync(password, SALT_ROUND);
};

// verify session cookie
export const sessionVerifier = async (req, res) => {
  try {
    // const token = req.headers.cookie.split("token=").at(1);
    const token = req.body.token;
    const result = jwtTokenVerifier(token);
    if (result)
      res.status(200).json({
        message: "Success",
        regId: result.regId,
        type: result.type,
      });
    else res.sendStatus(400);
  } catch (err) {
    return res.sendStatus(400);
  }
};

// login
export const sessionLogin = async (req, res) => {
  const { regId, password } = req.body;
  try {
    if (await authTable.exists({ regId: regId })) {
      const user = await authTable.findOne({ regId: regId }, "-_id -__v");
      if (!bcrypt.compareSync(password, user.password))
        return res.status(404).json({ message: "Password Not Matched" });
      return res.status(200).json({
        message: "Sucess",
        type: user.type,
        token: jwtTokenGenerator(user),
      });
    } else {
      return res.status(404).json({ message: "User Not Found" });
    }
  } catch (err) {
    return res.sendStatus(400);
  }
};

//logout
export const sessionLogout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout Success" });
};

// create new user account
export const createAccount = async (Id, password, type) => {
  const hashedPassword = hashPass(password);
  let Type = type;
  if (Id != "zeroOrOne" && Type != "admin") Type = "user";
  if (!(await authTable.exists({ regId: Id }))) {
    const newUser = await authTable.create({
      regId: Id,
      password: hashedPassword,
      type: Type,
    });
    return newUser;
  } else {
    return null;
  }
};

export const register = async (req, res) => {
  const { body } = req;
  if (body.password.length > 16) {
    return res.status(400).json({ Error: "Password is too long" });
  }
  try {
    const newUser = createAccount(body.regId, body.password, body.type);
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
};

// forget password
export const forgotPass = async (req, res) => {
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
      { regId: id },
      { password: hashedPassword }
    );
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
};
