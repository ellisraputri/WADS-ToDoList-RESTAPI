import React, { useState } from 'react'

export const EditTodoForm = ({ editToDo, task }) => {
    const [value, setValue] = useState(task.title)

    const handleSubmit = e => {
        e.preventDefault();

        editToDo(task._id, value, task.completed);
    }

    return (
        <form onSubmit={handleSubmit} className="TodoForm flex gap-2 p-4 bg-white rounded-lg shadow-md mr-4">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="todo-input border border-blue-900 mr-2 p-2 rounded-md text-black"
                placeholder='Update task' />

            <button
                type="submit"
                className='text-sm todo-btn text-blue-900 font-bold cursor-pointer hover:underline'>
                    Update Task</button>
        </form>
    )
}