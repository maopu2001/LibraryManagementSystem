import { Schema, model } from "mongoose";

const authSchema = new Schema({
  username: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const authTable = model("auth", authSchema);
export default authTable;
