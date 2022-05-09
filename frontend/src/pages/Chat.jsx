import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import {useEffect, useState} from 'react';
import { getUser, reset as user_reset } from '../features/auth/authSlice';
import { getMessages, sendMessage, deleteMessage, reset } from '../features/messages/messageSlice';
import { useParams, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import {AiOutlineSend} from 'react-icons/ai';
import ProfileData from '../components/ProfileData';


function Profile() {

    const params = useParams();
  
    const dispatch = useDispatch();
  
    const {messages, isLoading, isSuccess, isError, message} = useSelector((state) => state.messages);
  
    const user_state = useSelector((state) => state.auth);

    const { user, friend } = user_state;
  
    const message2 = user_state.message;
  
    const isLoading2 = user_state.isLoading;
  
    const isError2 = user_state.isError;

    useEffect(() => {
      if ( user) {
      var messages_div = document.getElementById("messages");
      if (messages_div) {
        window.scrollTo(0,messages_div.scrollHeight);
      }
    }
    }, [isSuccess]);
  
    useEffect(() => {
      if (user) {
      dispatch(getUser(params.reciever));
      dispatch(getMessages(params.reciever));
      }
    }, [dispatch, params]);

    useEffect(() => {
      if (isError){
        toast.error(message);
        dispatch(reset());
      }
      if (isError2){
        toast.error(message2);
        dispatch(user_reset());
      }
    }, [isError, isError2, message, message2]);
  
    if (isLoading || isLoading2) {
      return <Spinner />;
    }

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString().split(':')[0] + ':' + d.toLocaleTimeString().split(':')[1];
    }

    const submitForm = () => {
      var message = document.getElementById('message').value;
      if (message.length > 0) {
        dispatch(sendMessage({username: params.reciever, message: message}));
        dispatch(reset());
      }
    }
  
    return (
      <>
      {user ? (
      <div className='row-div'>
        <div style={{position: 'fixed'}}>
          <ProfileData user={user} friend={friend} isChat={true}/>
        </div>
      <div className="container" style={{marginLeft: '20%'}}>
        <div id="messages" style={{marginBottom: '100px'}}>
        {messages && messages.map(msg => (
          <div key={msg.id}>
            {msg.sender.toString() === user._id ?
            <div className="mssg-box-sender">
              <pre style={{fontSize: '18px', fontFamily: 'Helvetica'}}>{msg.text}</pre>
              <small>{formatDate(msg.createdAt)}</small>
            </div>: 
            <div className="mssg-box-reciever">
              <pre style={{fontSize: '18px', fontFamily: 'Helvetica'}}>{msg.text}</pre>
              <small>{formatDate(msg.createdAt)}</small>
            </div>}
          </div>
        ))}
        </div>
        <div>
          <form className="bottom-form" onSubmit={submitForm} >
            <div className="form-group">
              <div className='row-div'>
              <textarea className="form-control textarea-none" lines="1" id="message" name="message" aria-describedby="message" placeholder="Enter message"></textarea>
              <button type="submit" className="btn btn-success" ><AiOutlineSend/></button>
              </div>
              </div>
          </form>
        </div>
        </div>
        </div>
      ) : (<h2><Link to="/login">Login</Link> or <Link to="/register">Register</Link> to chat</h2>)}
      </>
    )
  }
  
  export default Profile