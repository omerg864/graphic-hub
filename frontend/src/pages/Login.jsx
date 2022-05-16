import {useState, useEffect} from 'react';
import {FaSignInAlt} from 'react-icons/fa';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate, Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import {login, reset} from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const {email, password} = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user, isLoading, isSuccess, isError, message} = useSelector((state) => state.auth);

    useEffect(() => {
        if(isError){
            toast.error(message);
        }
        if((isSuccess && user) || user){
            navigate("/");

        }
        dispatch(reset());
    }, [user, isSuccess, isError, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState, [e.target.name] : e.target.value,
        })
        )
    }

    const onSubmit = async e => {
        e.preventDefault();
        dispatch(login({email, password}));
    }

    if (isLoading) {
        return <Spinner />;
    }
  return (
    <>
    <section className="heading">
        <h1>
            Login <FaSignInAlt/>
            </h1>
            <p className="sub_title">
                Please login to your account
            </p>
    </section>
    <section className="form">
        <form onSubmit={onSubmit}>
            <div className="form-group">
            <input type="email" className="form-control" placeholder="Enter your email" id="email" name="email" 
            value={email} onChange={onChange}/>
            </div>
            <div className="form-group">
            <input type="password" className="form-control" placeholder="Enter your password" id="password" name="password" 
            value={password} onChange={onChange}/>
            </div>
            <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block">Login</button>
            </div>
        </form>
        <div>
            <p>Forgot your password? <Link to="/forgotPassword">Reset Password</Link></p>
        </div>
    </section>
    </>
  )
}

export default Login