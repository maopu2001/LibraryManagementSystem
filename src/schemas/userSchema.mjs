import { Schema, model } from "mongoose";

const userSchema = new Schema({
  regId: {
    type: Number,
    unique: true,
    index: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  dept: {
    type: String,
    required: true,
  },
  batch: {
    type: Number,
    required: true,
  },
  bookList: [],
});

const userTable = model("user", userSchema);
export default userTable;
