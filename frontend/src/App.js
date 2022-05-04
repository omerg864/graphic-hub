import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './components/Header';
import {ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verification from './pages/Verification';
import Profile from './pages/Profile';
import Project from './pages/Project';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Search from './pages/Search';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <>
    <ToastContainer theme="colored"/>
    <Router>
    <Header/>
    <div className='container'>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verify/:id" element={<Verification/>} />
        <Route path="/:username" element={<Profile/>} />
        <Route path="/:username/:project" element={<Project/>} />
        <Route path="/chat/:reciever" element={<Chat/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/search/:searchKey" element={<Search/>} />
      </Routes>
    </div>
    </Router>
    </>
  );
}

export default App;