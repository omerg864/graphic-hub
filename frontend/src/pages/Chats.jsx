import {useDispatch, useSelector} from 'react-redux';
import {getUser, reset as user_reset} from '../features/auth/authSlice';
import {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {reset, getChats, deleteChats} from '../features/messages/messageSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';


function Chats() {

    const dispatch = useDispatch();
    const user_state = useSelector((state) => state.auth);
    const {user} = user_state;
    const message2 = user_state.message;
    const isLoading2 = user_state.isLoading;
    const isError2 = user_state.isError;
    const {messages, chats, isLoading, isSuccess, isError, message} = useSelector((state) => state.messages);

    useEffect(() => {
        if (user) {
            dispatch(getChats());
        }
    }, []);

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString().split(':')[0] + ':' + d.toLocaleTimeString().split(':')[1];
      }
    
      useEffect(() => {
          if (user) {
          dispatch(getChats());
      }
        }, [dispatch, isSuccess]);
    
    const deleteChat = (username) => {
        dispatch(deleteChats(username));
        dispatch(reset());
    }

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
        if (isError2){
            toast.error(message2);
            dispatch(user_reset());
        }
    }, [isError, isError2, message, message2, dispatch]);

    if (isLoading || isLoading2) {
        return <Spinner />;
    }

  return (
    <>
    {user ? (<>
    <div className='center-div'>
    <h1>My Chats</h1>
    </div>
    {chats.map((chat) => (
        <div className="card mb-3" key={chat.id}>
            <div className="card-header">
                <div className="space">
                    <div>
                        <Link to={`/chat/${chat.user.username}`}>
                            <h5 className="card-title">{chat.user.f_name} {chat.user.l_name} <small> ({chat.user.username})</small></h5>
                        </Link>
                    </div>
                    <div>
                        <button className="btn btn-danger" onClick={() => deleteChat(chat.user.username)}>Delete Chat</button>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <p className="card-text"><a style={{fontWeight: 'bold', color: 'black'}}>{chat.recievd ? chat.user.f_name : 'You'}:</a> {chat.text}</p>
                <div>
                    <small className="text-muted">{formatDate(chat.createdAt)}</small>
                </div>
            </div>
        </div>
    ))}
    </>): (<h2><Link to="/login">Login</Link> or <Link to="/register">Register</Link> to view chats</h2>)}
    </>
  )
}

export default Chats