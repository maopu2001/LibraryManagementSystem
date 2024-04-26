import { Schema, model } from "mongoose";

const authSchema = new Schema(
  {
    regId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const authTable = model("auth", authSchema);
export default authTable;
