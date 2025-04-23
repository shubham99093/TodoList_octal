import { Request, Response } from "express";
import { TodoList } from "../models/todoModel";

export const getItems = async (req: Request, res: Response) => {
  try {
    const data = await TodoList.find({
      //@ts-ignore
      userId: req.userId,
    });

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
      //@ts-ignore
      userId: req.userId,
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
    const todo = await TodoList.findById(id);
    if (!todo) {
      res.status(404).json({ msg: "todo list not found" });
      return;
    }
    //@ts-ignore
    if (todo.userId !== req.userId) {
      res.status(403).json({ msg: "use have no access to check this Item" });
    }

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
    const todoDetail = await TodoList.findById(id);
    if (!todoDetail) {
      res.status(404).json({ msg: "todo list not found" });
      return;
    }
    //@ts-ignore
    if (todoDetail.userId !== req.userId) {
      res.status(403).json({ msg: "use have no access to edit this Item" });
    }
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
    console.log(id);
    const todo = await TodoList.findById(id);
    console.log(todo);
    if (!todo) {
      res.status(404).json({ msg: "todo list not found" });
      return;
    }
    //@ts-ignore
    if (todo.userId.toString() !== req.userId) {
      res.status(403).json({ msg: "use have no access to delete this Item" });
      return;
    }
    const data = await TodoList.findByIdAndDelete(id);
    res.status(200).json(data);
    return;
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
