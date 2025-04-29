import express from "express"
import { addTodo, deleteTodo, editTodo, getTodo } from "../controller/todoController.js";
import userAuth from "../middleware/userAuth.js";

const todoRouter = express.Router();

todoRouter.post('/add-todo', userAuth, addTodo);
todoRouter.put('/edit-todo', userAuth, editTodo);
todoRouter.delete('/delete-todo', userAuth, deleteTodo);
todoRouter.get('/get-todo', userAuth, getTodo);

export default todoRouter
