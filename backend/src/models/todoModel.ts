import { Schema, model, connect } from "mongoose";

interface ITodoList {
  title: string;
  chacked: boolean;
}

const TodoListSchema = new Schema<ITodoList>({
  title: { type: String, required: true },
  chacked: { type: Boolean, default: false },
});

export const TodoList = model<ITodoList>("TodoList", TodoListSchema);
