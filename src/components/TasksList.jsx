import { Link } from "react-router-dom";
import SingleTask from "./SingleTask";
import { useState, useEffect } from 'react';
import { API_URL } from "../config";


const TasksList = () => {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/tasks`)
            .then(res => {
                if (!res.ok) throw new Error(`Błąd HTTP! Status: ${res.status}`)
                return res.json()
            })
            .then(data => {
                setTasks(data)
                setLoading(false)
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            })
    }, [])

    if (loading) return <p>Ładowanie...</p>
    if (error) return <p>Błąd: {error.message}</p>


    if (!tasks || tasks.length === 0) {
        return (
            <div className="no-tasks">
                <h2>Brak zadań do wykonania!</h2>
                <Link to="/new-task">Dodaj zadanie</Link>
            </div>
        )
    }

    return (
        <>
            <title>Lista zadań | ToDoApp</title>

            <Link to="/new-task">Dodaj zadanie</Link>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <SingleTask task={task} />
                    </li>
                ))}
            </ul>
        </>
    )
}

export default TasksList;