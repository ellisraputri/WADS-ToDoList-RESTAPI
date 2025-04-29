// import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export const Todo = ({task, toggleComplete, deleteToDo, editToDo}) => {
    return (
        <div className="Todo p-2 rounded-2xl pr-4 pl-4 bg-white shadow-md" key={task._id}>
            <p
                className={`${task.completed ? 'completed' : ""} m-2 text-xl font-bold text-blue-900`}>{task.title}
            </p>

            <div className='flex justify-between gap-0.5 mt-3'>
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task._id, task.title, !task.completed)}
                    className='mr-4 accent-blue-900 size-4 hover:cursor-pointer'
                />
                <span className="checkmark"></span>

                <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => editToDo(task._id)}
                    className='mr-4 text-green-800 hover:cursor-pointer'
                />

                <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => deleteToDo(task._id)}
                    className='text-red-800 hover:cursor-pointer'
                />
            </div>
        </div>
    )
}