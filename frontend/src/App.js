import './App.css';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from './components/Main';
import Login from './components/Login';
import Analysis from './components/Analysis';
import Form from './components/Form';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </Router>
  );
}

export default App;
