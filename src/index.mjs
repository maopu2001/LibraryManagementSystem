import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import routes from "./routes/indexRoute.mjs";
import cors from "cors";

config({ path: ".env" });

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.log(`Error: ${err}`));

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the backend of LibraryManagementProject");
});

app.listen(process.env.PORT, () =>
  console.log(`Running on PORT ${process.env.PORT}`)
);
