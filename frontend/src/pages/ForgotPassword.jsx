import {useDispatch, useSelector} from 'react-redux';
import {reset, createResetPassword} from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ForgotPassword() {
    

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isLoading, isSuccess, isError, message} = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');

    const onChange = (e) => {
        setEmail(e.target.value);
    }

    const onSubmit = () => {
        dispatch(createResetPassword({email}));
    }

    useEffect(() => {
        if(isError){
            toast.error(message);
            dispatch(reset());
        }
        if(isSuccess){
            toast.success("Email sent successfully");
            dispatch(reset());
            navigate("/login");
        }
    }, [isSuccess, isError, message, dispatch]);

    if (isLoading) {
        return <Spinner />;
    }
  return (
    <>
        <div className="container">
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card">
                        <div className="card-header">
                            <h1>Forgot Password</h1>
                        </div>
                        <div className="card-body">
                            <form onSubmit={onSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" className="form-control" required id="email" placeholder="Enter your email" value={email} onChange={onChange} />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Reset</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default ForgotPassword