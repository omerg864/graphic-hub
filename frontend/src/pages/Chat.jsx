import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import {useEffect, useState} from 'react';
import { getUser } from '../features/auth/authSlice';
import { getMessages, sendMessage, deleteMessage, reset } from '../features/messages/messageSlice';
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import {AiOutlineSend} from 'react-icons/ai';
import ProfileData from '../components/ProfileData';


function Profile() {

    const params = useParams();
  
    const dispatch = useDispatch();
  
    const {messages, isLoading, isSuccess, isError, message} = useSelector((state) => state.messages);
  
    const { user, friend, isSuccess2, isError2, isLoading2, message2} = useSelector((state) => state.auth);

    useEffect(() => {
      var messages_div = document.getElementById("messages");
      console.log(messages_div.scrollHeight);
      window.scrollTo(0,messages_div.scrollHeight);
    }, [isSuccess]);
  
    useEffect(() => {
      if (isError){
        toast.error(message);
      }
      if (isError2){
        toast.error(message2);
      }
      dispatch(getUser(params.reciever));
      dispatch(getMessages(params.reciever));

    }, [dispatch, params, isError, message, isError2, message2]);
  
    if (isLoading || isLoading2) {
      return <Spinner />;
    }

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString().split(':')[0] + ':' + d.toLocaleTimeString().split(':')[1];
    }

    const submitForm = () => {
      var message = document.getElementById('message').value;
      console.log(message);
      if (message.length > 0) {
        dispatch(sendMessage({username: params.reciever, message: message}));
        dispatch(reset());
      }
    }
  
    return (
      <>
      <div className='row-div'>
        <div style={{position: 'fixed'}}>
          <ProfileData user={user} friend={friend} isChat={true}/>
        </div>
      <div className="container" style={{marginLeft: '20%'}}>
        <div id="messages" style={{marginBottom: '100px'}}>
        {messages.map(msg => (
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
      </>
    )
  }
  
  export default Profile