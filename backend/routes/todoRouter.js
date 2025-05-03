import express from "express"
import { addTodo, deleteTodo, editTodo, getTodo } from "../controller/todoController.js";
import userAuth from "../middleware/userAuth.js";

const todoRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Todo
 *   description: To Do Tasks related APIs
 */

/**
 * @swagger
 * /add-todo:
 *   post:
 *     tags:
 *       - Todo
 *     summary: Add a new todo task for the authenticated user
 *     description: |
 *       **Adds a new task** to the todo list for the authenticated user. 
 *       The task is initially marked as incomplete (`completed: false`).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user adding the todo
 *               title:
 *                 type: string
 *                 description: The title of the todo task
 *                 example: 'Buy groceries'
 *     responses:
 *       200:
 *         description: New task added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: New task added successfully
 *       400:
 *         description: Missing task title
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please fill in the task title.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *     security:
 *       - cookieAuth: []  
 */
todoRouter.post('/add-todo', userAuth, addTodo);

/**
 * @swagger
 * /edit-todo:
 *   put:
 *     tags:
 *       - Todo
 *     summary: Edit an existing todo task for the authenticated user
 *     description: |
 *       **Updates the title and completion status** of an existing todo task.
 *       The task is identified by the `todoId` and can be updated with a new `title` and/or a new `completed` status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - todoId
 *               - title
 *               - completed
 *             properties:
 *               todoId:
 *                 type: integer
 *                 description: The ID of the todo task being edited
 *               title:
 *                 type: string
 *                 description: The new title of the todo task
 *               completed:
 *                 type: boolean
 *                 description: The new completion status of the todo task
 *                 example: false
 *     responses:
 *       200:
 *         description: Task edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task edited successfully
 *       400:
 *         description: Missing task title or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please fill in the task.
 *       500:
 *         description: Internal server error or task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *     security:
 *       - cookieAuth: []  
 */
todoRouter.put('/edit-todo', userAuth, editTodo);

/**
 * @swagger
 * /delete-todo:
 *   delete:
 *     tags:
 *       - Todo
 *     summary: Delete an existing todo task for the authenticated user
 *     description: |
 *       **Deletes a todo task** identified by the `todoId`. 
 *       This action permanently removes the task from the todo list.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - todoId
 *             properties:
 *               todoId:
 *                 type: integer
 *                 description: The ID of the todo task to be deleted
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       500:
 *         description: Internal server error or task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *     security:
 *       - cookieAuth: []  
 */
todoRouter.delete('/delete-todo', userAuth, deleteTodo);

/**
 * @swagger
 * /get-todo:
 *   get:
 *     tags:
 *       - Todo
 *     summary: Get all todo tasks for the authenticated user
 *     description: |
 *       **Retrieves all todo tasks** associated with the authenticated user, identified by `userId`.
 *       It returns a list of tasks with their details (e.g., title, completed status).
 *     responses:
 *       200:
 *         description: List of todos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 todos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the todo task
 *                       title:
 *                         type: string
 *                         description: The title of the todo task
 *                       completed:
 *                         type: boolean
 *                         description: The completion status of the todo task
 *                       userId:
 *                         type: integer
 *                         description: The ID of the user associated with the task
 *       500:
 *         description: Internal server error or issues retrieving todos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *     security:
 *       - cookieAuth: []  
 */
todoRouter.get('/get-todo', userAuth, getTodo);

export default todoRouter
