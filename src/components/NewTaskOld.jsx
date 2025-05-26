import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";

const NewTask = () => {

    const [titleError, setTitleError] = useState();
    const [endDateError, setEndDateError] = useState();
    const navigate = useNavigate();

    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        endDate: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (id) {
            setLoading(true);
            fetch(`${API_URL}/tasks/${id}`)
                .then(res => {
                    if (!res.ok) throw new Error(`Błąd HTTP! Status: ${res.status}`)
                    return res.json()
                })
                .then(data => {
                    setFormData({
                        title: data.title,
                        desc: data.desc,
                        endDate: new Date(data.endDate).toISOString().split('T')[0],
                        addDate: data.addDate,
                        done: data.done
                    });
                    setLoading(false)
                })
                .catch(error => {
                    setError(error)
                    setLoading(false);
                })
        } else {
            setFormData({
                title: '',
                desc: '',
                endDate: new Date().toISOString().split('T')[0],
                addDate: '',

            });
            setLoading(false);
        }
    }, [id])

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {
            title: !formData.title.trim(),
            endDate: !formData.endDate
        };

        setTitleError(errors.title);
        setEndDateError(errors.endDate);
        if (errors.title || errors.endDate) return;

        const url = id ? `${API_URL}/tasks/${id}` : `${API_URL}/tasks`;
        const method = id ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData,
                addDate: id ? formData.addDate : new Date().toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                done: id ? formData.done : false
            })
        })
            .then(res => {
                if (!res.ok) throw new Error('Błąd zapisu');
                navigate('/');
            })
            .catch(error => {
                alert(`Błąd: ${error.message}`);
            });
    }


    const minDate = new Date().toISOString().split('T')[0];

    const handleBack = () => {
        if (window.confirm("Czy na pewno chcesz wyjść? Niezapisane dane zostaną utracone.")) {
            navigate('/');
        }
    }


    if (loading) return <p>Ładowanie...</p>
    if (error) return <p>Błąd: {error.message}</p>

    return (
        <>
            <title>Dodaj zadanie | ToDoApp</title>
            <form onSubmit={handleSubmit}>
                <p>
                    <label htmlFor="title">Nowe zadanie*</label>
                    <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    {titleError && (
                        <span className="error">Uzupełnij to pole</span>
                    )}
                </p>
                <p>
                    <label htmlFor="desc">Opis zadania</label>
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
                        min={id ? null : minDate}
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                    {endDateError && (
                        <span className="error">Wybierz datę</span>
                    )}
                </p>
                <p>
                    <button>{id ? 'Zapisz zmiany' : 'Dodaj zadanie'}</button>
                </p>
            </form>
            <button className="backBtn" onClick={handleBack}>Wróć</button>
        </>
    )
}

export default NewTask;