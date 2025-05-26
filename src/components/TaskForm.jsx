import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";

const TaskForm = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        addDate: '',
        endDate: '',
        done: ''
    })
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    const [emptyTitle, setEmptyTitle] = useState();
    const [epmtyEndDate, setEmptyEndDate] = useState();

    const { taskId } = useParams();

    useEffect(() => {
        if (taskId) {
            try {
                fetch(`${API_URL}/tasks/${taskId}`)
                    .then(res => {
                        if (!res.ok) throw new Error(`Błąd HTTP. ${res.status}`);
                        return res.json();
                    })
                    .then(data => {
                        setFormData({
                            title: data.title,
                            desc: data.desc,
                            addDate: data.addDate,
                            endDate: new Date(data.endDate).toISOString().split('T')[0],
                            done: data.done
                        })
                        setLoading(false);
                    })

            } catch (error) {
                setApiError(error);
                setLoading(false);
            }
        } else {
            setFormData({
                title: '',
                desc: '',
                addDate: '',
                endDate: '',
                done: ''

            });
            setLoading(false);
        }
    }, [taskId])

    const handleSubmit = (e) => {
        e.preventDefault();

        let hasEmptyError = false;

        setEmptyTitle(false);
        setEmptyEndDate(false);

        if (!formData.title.trim()) {
            setEmptyTitle(true);
            hasEmptyError = true;
        }

        if (!formData.endDate) {
            setEmptyEndDate(true);
            hasEmptyError = true;
        }

        if (hasEmptyError) {
            return;
        }

        const url = taskId ? `${API_URL}/tasks/${taskId}` : `${API_URL}/tasks`;
        const method = taskId ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData,
                addDate: taskId ? formData.addDate : new Date().toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                done: taskId ? formData.done : false
            })
        })
            .then(res => {
                if (!res.ok) throw new Error('Błąd zapisu');
                navigate('/')
            })
            .catch(error =>
                alert(`Błąd: ${error.message}`)
            )
    }

    const minDate = new Date().toISOString().split('T')[0];


    const handleBack = () => {
        if (window.confirm('Czy na pewno chcesz wyjść? Niezapisane dane zostaną utracone.')) {
            navigate('/')
        }
    }

    if (loading) return <p>Ładowanie...</p>
    if (apiError) return <p>Błąd {apiError.message}</p>


    return (
        <>
            <title>{taskId ? `Edytuj zadanie: ${formData.title} | ToDoApp` : 'Dodaj zadanie | ToDoApp'}</title>
            <form onSubmit={handleSubmit}>
                <p>
                    <label htmlFor="title">Nazwa zadania*</label>
                    <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    {emptyTitle && (
                        <span className="error">Dodaj nazwę zadania</span>
                    )}
                </p>
                <p>
                    <label htmlFor="desc">Opis</label>
                    <textarea
                        id="desc"
                        value={formData.desc}
                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    />
                </p>
                <p>
                    <label htmlFor="endDate">Wykonać do*</label>
                    <input
                        id="endDate"
                        type="date"
                        min={taskId ? '' : minDate}
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                    {epmtyEndDate && (
                        <span className="error">Dodaj datę wykonania.</span>
                    )}
                </p>
                <p>
                    <button>{taskId ? 'Zapisz zmiany' : 'Dodaj zadanie'}</button>
                </p>
            </form>
            <button className="backBtn" onClick={handleBack}>Wróć</button>
        </>
    )
}

export default TaskForm;