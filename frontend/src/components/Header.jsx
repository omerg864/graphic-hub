import {FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';


function Header() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  }

  const gotoLogin = () => {
    navigate('/login');
  }

  const gotoRegister = () => {
    navigate('/register');
  }

  const gotoProfile = () => {
    navigate(`${user.username}`);
  }

  const search = () => {
    var search_txt = document.getElementById('search_txt').value;
    if (search_txt.length > 0) {
      navigate(`/search/${search_txt}`);
    } else {
      toast.error('Please enter a search term.');
    }
  }

  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">GraphicHub</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        <input class="form-control me-2" type="search" placeholder="Search" id="search_txt" aria-label="Search"/>
        <button class="btn btn-outline-success" onClick={search}>Search</button>
      </ul>
          {user ? (
          <>
          <ul class="navbar-nav">
          <li class="nav-item">
          <button class="btn btn-secondary btn-left" onClick={gotoProfile}> Profile</button>
          </li>
          <li class="nav-item">
            <button class="btn btn-secondary" onClick={onLogout}><FaSignOutAlt /> Logout</button>
          </li>
          </ul>
          </>) : (<>
            <ul class="navbar-nav nav-buttons">
          <li class='nav-item'>
            <button class="btn btn-secondary btn-left" onClick={gotoLogin}><FaSignInAlt/> Login</button>
            </li>
            <li class='nav-item'>
            <button class="btn btn-secondary" onClick={gotoRegister}><FaUser/>Register</button>
            </li>
            </ul>
          </>)}
    </div>
  </div>
  </nav>
  )
}

export default Header;