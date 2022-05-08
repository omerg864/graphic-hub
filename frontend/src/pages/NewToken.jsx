import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createViewToken, reset as token_reset } from '../features/viewTokens/viewTokenSlice';
import Spinner from '../components/Spinner';


function NewToken() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);


    const view_tokens_state = useSelector((state) => state.viewToken);
    const viewTokens = view_tokens_state.viewTokens;
    const isLoading2 = view_tokens_state.isLoading;
    const isError2 = view_tokens_state.isError;
    const isSuccess2 = view_tokens_state.isSuccess;
    const message2 = view_tokens_state.message;

    const newToken = () => {
        const name = document.getElementById('name').value;
        const expires = document.getElementById('expires').value;
        dispatch(createViewToken({
            name: name,
            expires: expires,
        }));
    }

    useEffect(() => {
        if (isSuccess2) {
            dispatch(token_reset());
            navigate('/settings');
        }
        if (isError2) {
            toast.error(message2);
            dispatch(token_reset());
        }
    }, [isSuccess2, isError2, message2]);

    if (isLoading2){
        return <Spinner />;
    }


  return (
    <>
    <div className='center-div'>
    <div className="content-section" style={{width: 'fit-content'}}>
    <div className="center-div">
        <h1>Create New View Token</h1>
        </div>
        <div className="form-group" style={{marginBottom: '10px'}}>
            <label style={{fontWeight: '600'}}>Token Name</label>
            <input type="text" className="form-control" name="name" id="name" placeholder="Token Name" />
            </div>
        <div className="form-group">
            <label style={{fontWeight: '600'}}>Token expires in</label>
            <select className="form-select" name="expires" id="expires" aria-label="Default select example">
            <option value="Never" selected>Never</option>
            <option value="1">1 Day</option>
            <option value="30">30 Days</option>
            <option value="90">90 Days</option>
            </select>
            </div>
            <div className='center-div' style={{marginTop: '10px'}}>
        <button className="btn btn-primary" type="button" onClick={newToken}>Create</button>
        </div>
    </div>
    </div>
    </>
  )
}

export default NewToken