import express from "express";
import cors from "cors";
import "dotenv/config";
import "./db";

import {
  addItem,
  checkItem,
  deleteItem,
  editItem,
  getItems,
} from "./controller/todoController";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This sever is for Todo app");
});

app.get("/getitems", getItems);

app.post("/additem", addItem);

app.put("/checkitem", checkItem);

app.put("/edititem", editItem);

app.delete("/deleteitem", deleteItem);

app.delete("/clearitems", checkItem);

app.listen(process.env.PORT, () => {
  console.log(`app is running on http://localhost:${process.env.PORT}/`);
});
