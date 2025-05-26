import { useState } from "react";
import { API_URL } from '../config';
import { Link } from "react-router-dom";

const SingleTask = ({ task }) => {

    const [done, setDone] = useState(task.done);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDone = async (e) => {

        const changeDone = e.target.checked;
        setDone(changeDone);
        setIsUpdating(true);

        try {
            const res = await fetch(`${API_URL}/tasks/${task.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ done: changeDone })
            });
            if (!res.ok) throw new Error(`Błąd HTTP. Status: ${res.status}`)
        } catch (error) {
            alert("Błąd podczas aktualizacji statusu zadania!");
            setDone(!changeDone);
        } finally {
            setIsUpdating(false);
        }
    }

    const formater = new Intl.DateTimeFormat('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })

    const formatDate = (date) => {
        return formater.format(new Date(date));
    }

    return (
        <article>
            <h2>{task.title}</h2>
            <p>{task.desc}</p>
            <div className="task-dates">
                <p>Data dodania: <span>{formatDate(task.addDate)}</span></p>
                <p>Data realizacji: <span>{formatDate(task.endDate)}</span></p>
            </div>
            <div className="done-checkbox">
                <label htmlFor="done">Wykonane</label>
                <input
                    id="done"
                    type="checkbox"
                    onChange={handleDone}
                    checked={done}
                    disabled={isUpdating}
                />
            </div>
            <Link className="single-task-action" to={`/edit-task/${task.id}`}>EDYTUJ</Link>
            <Link className="single-task-action" to={`/delete/${task.id}`}>USUŃ</Link>
        </article >
    )
}

export default SingleTask;