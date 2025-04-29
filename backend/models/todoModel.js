import mongoose from "mongoose";


const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true}, 
  }, { timestamps:true});

const todoModel = mongoose.models.todo || mongoose.model('todo', todoSchema);

export default todoModel