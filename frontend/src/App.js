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
import Chats from './pages/Chats';
import NewProject from './pages/NewProject';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import Popper from 'popper.js';
import EditProject from './pages/EditProject';
import NewToken from './pages/NewToken';
import EditToken from './pages/EditToken';

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
        <Route path="/chats" element={<Chats/>} />
        <Route path="/NewProject" element={<NewProject/>} />
        <Route path="/:username/:project/edit" element={<EditProject/>} />
        <Route path="/NewToken" element={<NewToken/>} />
        <Route path="/EditToken/:id" element={<EditToken/>} />
      </Routes>
    </div>
    </Router>
    </>
  );
}

export default App;