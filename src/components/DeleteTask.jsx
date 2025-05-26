import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";

const DeleteTask = () => {

    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/tasks/${taskId}`)
            .then(res => {
                if (!res.ok) throw new Error(`Błąd HTTP! Status: ${res.status}`);
                return res.json()
            })
            .then(data => {
                setTask(data);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                setError(error)
            })
    }, [taskId])

    const handleBack = () => {
        navigate(-1);
    }

    const deleteTask = () => {
        fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE'
        }
        )
            .then(res => {
                if (res.ok) {
                    navigate('/')
                } else {
                    throw new Error(`Błąd HTTP! Status: ${res.status}`)
                }
            })
            .catch(error => {
                window.alert(`Błąd: ${error.message}`)
            })
    }

    if (loading) return <p>Ładowanie...</p>
    if (error) return <p>Błąd: {error.message}</p>
    if (!task) return <p>Nie znaleziono zadania.</p>

    return (
        <>
            <title>{`Usuń zadanie ${task.title} | ToDoApp`}</title>

            <h2>{task.title}</h2>
            <p>Czy na pewno chcesz usunąć to zadanie?</p>
            <ul>
                <li><button onClick={deleteTask}>Usuń</button></li>
                <li><button onClick={handleBack}>Wróć</button></li>
            </ul>
        </>
    )
}

export default DeleteTask;