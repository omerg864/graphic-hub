import { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import PasswordForm from '../components/PasswordForm';

function PasswordChange() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if(isError){
            toast.error(message);
            dispatch(reset());
        }
        if(isSuccess){
            toast.success("Password changed successfully");
            dispatch(reset());
            navigate("/settings");
        }
    }, [isSuccess, isError, message, navigate, dispatch]);


    if (isLoading) {
        return <Spinner />;
    }

  return (
    <>
    <div className="center-div">
        <div className="content-section">
    <h1>Password Change</h1>
    <PasswordForm type="Change" />
    </div>
    </div>
    </>
  )
}

export default PasswordChange