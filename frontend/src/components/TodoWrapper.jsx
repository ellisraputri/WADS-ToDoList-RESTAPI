import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Todo } from './Todo.jsx';
import { TodoForm } from './TodoForm.jsx';
import { EditTodoForm } from './EditTodoForm.jsx';
import { AppContent } from '../context/AppContext.jsx';
import axios from 'axios';
import {toast} from 'react-toastify';

export const TodoWrapper = () => {
    const [toDos, setToDos] = useState([])
    const [showCompleted, setShowCompleted] = useState(false);
    const navigate = useNavigate();
    const {backendUrl, userData} = useContext(AppContent);

    const addToDo = async(toDo) => {
        try {
            const {data} =await axios.post(backendUrl+'api/todo/add-todo', {title:toDo});
            if(data.success){
                toast.success(data.message);
                fetchToDos();
            }
    
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);  // This is for 400/401/500 errors
            } else {
                toast.error("Something went wrong");
            }
            console.error(error);
        }
        
    }

    const editTask = async(id,title,completed) => {
        try {
            const {data} =await axios.put(backendUrl+'api/todo/edit-todo', {todoId:id, title:title, completed:completed});
            if(data.success){
                toast.success(data.message);
                fetchToDos();
            }
    
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);  // This is for 400/401/500 errors
            } else {
                toast.error("Something went wrong");
            }
            console.error(error);
        }
    }

    const deleteToDo = async(id) => {
        try {
            const {data} = await axios.delete(backendUrl + 'api/todo/delete-todo', {
                data: { todoId: id }
            });
            if(data.success){
                toast.success(data.message);
                fetchToDos();
            }
    
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);  // This is for 400/401/500 errors
            } else {
                toast.error("Something went wrong");
            }
            console.error(error);
        }
        
    }

    const editToDo = id => {
        setToDos(toDos.map((todo) => todo._id === id ? {...
            todo, isEditing: !todo.isEditing} : todo));
    }    

    const toggleCompletedFilter = () => {
        setShowCompleted(!showCompleted);
    };

    const filteredTasks = showCompleted
        ? toDos.filter((todo) => todo.completed)
        : toDos;

    
    const fetchToDos = async () => {
        try {
            const {data} =await axios.get(backendUrl+'api/todo/get-todo');
            if(data.success){
                setToDos(data.todos);
            }
    
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);  // This is for 400/401/500 errors
            } else {
                toast.error("Something went wrong");
            }
            console.error(error);
        }
    };

    useEffect(() => {
        fetchToDos();
    }, [userData]);

    return (
        <>
        <h1 className='text-3xl mt-10 text-center font-bold text-blue-950 m-3 underline'>To Do List</h1>
        <div className="TodoWrapper m-8 flex flex-col items-center gap-4 p-4">
            <button className='border-l-blue-900 border-b-blue-900 p-2 rounded-2xl text-blue-900 shadow-md bg-white font-bold hover:cursor-pointer hover:bg-blue-50 mb-2 ' onClick={toggleCompletedFilter}>
                {showCompleted ? 'Show All' : 'Show Completed'}
            </button>

            <TodoForm addToDo={addToDo} />
            {filteredTasks.map((todo) => (
                todo.isEditing ? (
                    <EditTodoForm
                        editToDo={editTask}
                        task={todo}
                    />
                ) : (
                    <Todo
                        key={todo._id}
                        task={todo}
                        toggleComplete={editTask}
                        deleteToDo={deleteToDo}
                        editToDo={editToDo}
                    />
                )
            ))}
        </div>
        </>
    )
}