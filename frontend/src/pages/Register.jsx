import {useState, useEffect} from 'react';
import {FaUser} from 'react-icons/fa';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {register, reset} from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Register() {
    const [formData, setFormData] = useState({
        f_name: "",
        l_name: "",
        username: "",
        email: "",
        company: "",
        password: "",
        password2: ""
    });
    const {f_name, l_name, username, email, company, password, password2} = formData;

    const username_regex = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;

    const password_regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user, isLoading, isSuccess, isError, message} = useSelector((state) => state.auth);

    useEffect(() => {
        if(isError){
            toast.error(message);
        }
        if(isSuccess || user){
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
        const password_input = document.getElementById("password");
        const password2_input = document.getElementById("password2");
        const username_input = document.getElementById("username");
        e.preventDefault();
        if(password !== password2){
            toast.error("Passwords do not match");
            password_input.style.borderColor = '#ff4c4c';
            password_input.classList.add('error');
            setTimeout(function() {
                password_input.classList.remove('error');
            }, 300);
            password2_input.style.borderColor = '#ff4c4c';
            password2_input.classList.add('error');
            setTimeout(function() {
                password2_input.classList.remove('error');
            }, 300);
            return;
        }
        if (!username_regex.test(username)){
            toast.error("Username must be between 3 and 18 characters and can only contain letters, numbers, underscores, and dashes");
            username_input.style.borderColor = '#ff4c4c';
            username_input.classList.add('error');
            setTimeout(function() {
                username_input.classList.remove('error');
            }, 300);
            return;
        }
        if (!password_regex.test(password)){
            toast.error("Password must be between 8 and 32 characters and must contain at least one number, one uppercase letter, and one lowercase letter");
            password_input.style.borderColor = '#ff4c4c';
            password_input.classList.add('error');
            setTimeout(function() {
                password_input.classList.remove('error');
            }, 300);
            return;
        }
        dispatch(register({f_name, l_name, username, email, company, password}));
    }
    if (isLoading) {
        return <Spinner />;
    }
  return (
    <>
    <section className="heading">
        <h1>
            Register <FaUser/>
            </h1>
            <p className='sub_title'>
                Please create an account
            </p>
    </section>
    <section className="form">
        <form onSubmit={onSubmit}>
        <div className="form-group">
            <input type="text" required className="form-control" placeholder="Enter your username" id="username" name="username" 
            value={username} onChange={onChange}/>
            </div>
            <div className="form-group">
            <input type="text" required className="form-control" placeholder="Enter your first name" id="f_name" name="f_name" 
            value={f_name} onChange={onChange}/>
            </div>
            <div className="form-group">
            <input type="text" required className="form-control" placeholder="Enter your last name" id="l_name" name="l_name" 
            value={l_name} onChange={onChange}/>
            </div>
            <div className="form-group">
            <input type="email" required className="form-control" placeholder="Enter your email" id="email" name="email" 
            value={email} onChange={onChange}/>
            </div>
            <div className="form-group">
            <input type="text" className="form-control" placeholder="Enter your company's name" id="company" name="company" 
            value={company} onChange={onChange}/>
            </div>
            <div className="form-group">
            <input type="password" required className="form-control" placeholder="Enter your password" id="password" name="password" 
            value={password} onChange={onChange}/>
            </div>
            <div className="form-group">
            <input type="password" required className="form-control" placeholder="Confirm your password" id="password2" name="password2" 
            value={password2} onChange={onChange}/>
            </div>
            <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block">Register</button>
            </div>
        </form>
    </section>
    </>
  )
}

export default Register