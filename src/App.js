import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import TasksList from './components/TasksList';
import DeleteTask from './components/DeleteTask';
import TaskForm from './components/TaskForm';

function App() {

  return (
    <>
    <title>ToDoApp</title>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<TasksList />} />
            <Route path='/new-task' element={<TaskForm />} />
            <Route path='/edit-task/:taskId' element={<TaskForm />} />
            <Route path='delete/:taskId' element={<DeleteTask />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
