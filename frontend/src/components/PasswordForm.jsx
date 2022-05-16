import {useState} from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updatePassword, resetPassword } from '../features/auth/authSlice';
import { useParams } from 'react-router-dom';

function PasswordForm({ type }) {

    const dispatch = useDispatch();
    const params = useParams();
    const [formData, setFormData] = useState({
        password: "",
        password2: "",
        oldPassword : ""
    });

    const {password, password2, oldPassword} = formData;

    const password_regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState, [e.target.name] : e.target.value,
        })
        )
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (type === 'Change') {
        const oldPassword_input = document.getElementById("oldPassword");
        if (!password_regex.test(oldPassword)) {
            toast.error("Old Password is not valid");
            oldPassword_input.style.borderColor = '#ff4c4c';
            oldPassword_input.classList.add('error');
            setTimeout(function() {
                oldPassword_input.classList.remove('error');
            }, 300);
            return;
        }
        }
        const password_input = document.getElementById("password");
        const password2_input = document.getElementById("password2");
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
        if (!password_regex.test(password)){
            toast.error("Password must be at least 8 characters long, contain at least one number, one lowercase and one uppercase letter");
            password_input.style.borderColor = '#ff4c4c';
            password_input.classList.add('error');
            setTimeout(function() {
                password_input.classList.remove('error');
            }, 300);
            return;
        }
        if (type === 'Change') {
        dispatch(updatePassword({password, oldPassword}));
        } else {
            dispatch(resetPassword({password, token: params.token}));
        }
    }
  return (
    <form onSubmit={onSubmit}>
    {type === "Change" && <div className="form-group"  style={{marginTop: '10px'}}>
    <a style={{fontWeight: '600'}}>Old Password</a>
            <input type="password" required className="form-control" placeholder="Enter your old password" id="oldPassword" name="oldPassword" 
            value={oldPassword} onChange={onChange}/>
            </div> }
    <div className="form-group"  style={{marginTop: '10px'}}>
    <a style={{fontWeight: '600'}}>New Password</a>
            <input type="password" required className="form-control" placeholder="Enter your password" id="password" name="password" 
            value={password} onChange={onChange}/>
            </div>
            <div className="form-group" style={{marginTop: '10px'}}>
            <a style={{fontWeight: '600'}}>Confirm New Password</a>
            <input type="password" required className="form-control" placeholder="Confirm your password" id="password2" name="password2" 
            value={password2} onChange={onChange}/>
            </div>
            <div className='center-div' style={{marginTop: '20px'}}>
            <button type="submit" className="btn btn-primary">{type}</button>
            </div>
    </form>
  )
}

export default PasswordForm