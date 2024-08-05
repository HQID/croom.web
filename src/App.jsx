import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Account from './pages/Account';
import Notes from './pages/Notes';
import Schedule from './pages/Schedule';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import {Toaster} from 'react-hot-toast'
import UserContextProvider from './context/UserContextProvider'
import axios from 'axios'

const apiBaseUrlDev = import.meta.env.VITE_API_BASE_URL_DEV
const apiBaseUrlProd = import.meta.env.VITE_API_BASE_URL_PROD
axios.defaults.baseURL = import.meta.env.MODE === 'production' ? apiBaseUrlProd : apiBaseUrlDev
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
    <Toaster position="bottom-right" toastOptions={{duration: 2000}} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/account' element={<Account />} />
          <Route path='/notes' element={<Notes />} />
          <Route path="/schedule" element={<Schedule/>} />
          <Route path="/chatbot" element={<Chatbot/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/changePassword/:token" element={<ChangePassword/>} />
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
