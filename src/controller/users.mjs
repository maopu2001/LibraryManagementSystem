import userTable from "../schemas/users.mjs";
import authTable from "../schemas/auths.mjs";

export const filterUserInfo = async (req, res) => {
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
      return res.status(200).json(Users);
    } else {
      return res.sendStatus(400);
    }
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
};

export const getUserInfoByID = async (req, res) => {
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
};

export const createUser = async (body) => {
  if (!(await userTable.exists({ regId: body.regId }))) {
    const newUser = await userTable.create(body);
    return newUser;
  } else return null;
};

export const insertUserInfo = async (req, res) => {
  const { body } = req;
  try {
    const newUser = createUser(body);
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
};

export const patchUserInfo = async (req, res) => {
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
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
};

export const deleteUserInfo = async (req, res) => {
  const { id } = req.params;
  try {
    if (await userTable.exists({ regId: id })) {
      await userTable.deleteOne({ regId: id });
      await authTable.deleteOne({ regId: id });
      const Users = await userTable
        .find({}, "-_id -name._id -__v")
        .sort({ regId: 1 });
      return res.status(200).json(Users);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(400).json({ Error: err });
  }
};
