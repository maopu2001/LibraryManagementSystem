import { Schema, model } from 'mongoose';

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
    type: String,
    default: '1st',
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
    default: 1,
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
      default: 0,
    },
    shelveNo: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  userList: [],
});

const bookTable = model('book', bookSchema);
export default bookTable;
