import todoModel from "../models/todoModel.js";


export const addTodo = async(req,res) =>{
    const {userId, title} = req.body;
    if(!title){
        return res.status(400).json({success:false, message:"Please fill in the task title."})
    }

    try {
        const newTodo = todoModel({
            title: title,
            completed: false,
            userId: userId
        });
        await newTodo.save();
        return res.status(200).json({ success: true, message: "New task added successfully" });

    } catch (error) {
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

export const editTodo = async(req,res)=>{
    const {todoId, title, completed} = req.body;
    try {
        if(!title){
            return res.status(400).json({success:false, message:"Please fill in the task."})
        }

        const todo = await todoModel.findById(todoId);
        if(!todo){
            return res.status(500).json({success:false, message:"Internal server error"})
        }
        todo.title = title;
        todo.completed =completed;
        await todo.save();

        return res.status(200).json({ success: true, message: "Task edited successfully" });

    } catch (error) {
        console.error(error)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

export const deleteTodo = async(req,res) =>{
    const {todoId} = req.body;
    try {
        const todo = await todoModel.findByIdAndDelete(todoId);
        if(!todo){
            return res.status(500).json({success:false, message:"Internal server error"})
        }
        return res.status(200).json({ success: true, message: "Task deleted successfully" });

    } catch (error) {
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}

export const getTodo = async(req,res) =>{
    const {userId} =req.body;
    try {
        const todos = await todoModel.find({userId: userId});
        return res.status(200).json({success:true, todos:todos});

    } catch (error) {
        console.log(userId);
        console.log(error)
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}