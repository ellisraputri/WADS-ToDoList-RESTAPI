import React, { useState } from 'react'

export const TodoForm = ({addToDo}) => {
    const [value, setValue] = useState("")

    const handleSubmit = e => {
        e.preventDefault();

        addToDo(value);

        setValue("");   
    }
    
    return (
        <form className="TodoForm" onSubmit={handleSubmit}>
            <input type="text"
                className="todo-input border border-blue-900 mr-4 p-1.5 rounded-2xl placeholder-cyan-800 text-black"
                value={value}
                placeholder="Enter task"
                onChange={(e) => setValue(e.target.value)}>
            </input>

            <button type="submit" className="todo-btn font-bold text-blue-900 border-l-blue-900 shadow-md bg-white  border-b-blue-900 p-2 rounded-2xl hover:cursor-pointer hover:bg-blue-50">
                Add Task</button>
        </form>
    )
}