import { Request, Response } from "express";
import { TodoList } from "../models/todoModel";

export const getItems = async (req: Request, res: Response) => {
  try {
    const data = await TodoList.find({});

    console.log(data);

    res.status(200).json(data);
  } catch (err) {
    console.log("Error Getting data");
    res.status(500).json({ msg: "Error Getting Data" });
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    const { todo } = req.body;
    const data = await TodoList.create({
      title: todo,
    });
    res.status(200).json(data);
  } catch (err) {
    console.log("Error add data");
    res.status(500).json({ msg: "Error Adding Data" });
  }
};

export const checkItem = async (req: Request, res: Response) => {
  try {
    const { id, check } = req.body;
    const data = await TodoList.findByIdAndUpdate(
      id,
      {
        $set: {
          chacked: check,
        },
      },
      { new: true }
    );
    res.status(200).json(data);
  } catch (err) {
    console.log("Error Updating data");
    res.status(500).json({ msg: "Error Updating Data" });
  }
};

export const editItem = async (req: Request, res: Response) => {
  try {
    const { id, todo } = req.body;
    const data = await TodoList.findByIdAndUpdate(
      id,
      {
        $set: {
          title: todo,
        },
      },
      { new: true }
    );
    res.status(200).json(data);
  } catch (err) {
    console.log("Error Updating data");
    res.status(500).json({ msg: "Error Updating Data" });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const data = await TodoList.findByIdAndDelete(id);
    res.status(200).json(data);
  } catch (err) {
    console.log("Error Deleting data");
    res.status(500).json({ msg: "Error Deleting Data" });
  }
};

export const clearItems = async (req: Request, res: Response) => {
  try {
    await TodoList.deleteMany({});
    res.status(200).json({ msg: "All Data Delete successfully" });
  } catch (err) {
    console.log("Error Deleting data");
    console.log(err);
    res.status(500).json({ msg: "Error Deleting Data" });
  }
};
