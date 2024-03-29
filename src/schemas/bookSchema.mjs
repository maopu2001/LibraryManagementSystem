import { Schema, model } from "mongoose";

const bookSchema = new Schema({
  ISBN: {
    type: Number,
    unique: true,
    index: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  edition: {
    type: Number,
  },
  author: {
    type: String,
    required: true,
  },
  publication: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  cover: {
    type: String,
  },
  catagory: {
    type: String,
    required: true,
  },
  shelfLoc: {
    shelfNo: {
      type: Number,
      required: true,
    },
    shelveNo: {
      type: Number,
      required: true,
    },
  },
  userList: [],
});

const bookTable = model("book", bookSchema);
export default bookTable;
