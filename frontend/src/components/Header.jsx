import {FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { BiUser } from 'react-icons/bi';
import {BsChatSquareText} from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { FiSettings } from 'react-icons/fi';


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

  const goToChats = () => {
    navigate('/chats');
  }

  const goToSettings = () => {
    navigate('/settings');
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
  <div className="container-fluid">
    <a className="navbar-brand" href="/">GraphicHub</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        <input className="form-control me-2" type="search" placeholder="Search" id="search_txt" aria-label="Search"/>
        <button className="btn btn-outline-success" onClick={search}>Search</button>
      </ul>
          {user ? (
          <>
          <ul className="navbar-nav">
          <li className="nav-item dropstart" style={{marginRight: '5px'}}>
          <a className="nav-link dropdown-toggle btn btn-secondary" style={{height: '38px', font: 'bold', fontSize: '16px', color: 'white'}} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <BiUser /> {user.username}
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><button className="dropdown-item" onClick={gotoProfile}><CgProfile /> Profile</button></li>
            <li><button className="dropdown-item" onClick={goToChats}><BsChatSquareText /> Chats</button></li>
            <li><button className="dropdown-item" onClick={goToSettings}><FiSettings /> Settings</button></li>
            <li><hr className="dropdown-divider"/></li>
            <li><button className="dropdown-item" onClick={onLogout}><FaSignOutAlt /> Logout</button></li>
          </ul>
        </li>
          </ul>
          </>) : (<>
            <ul className="navbar-nav nav-buttons">
          <li className='nav-item'>
            <button className="btn btn-secondary btn-left" onClick={gotoLogin}><FaSignInAlt/> Login</button>
            </li>
            <li className='nav-item'>
            <button className="btn btn-secondary" onClick={gotoRegister}><FaUser/>Register</button>
            </li>
            </ul>
          </>)}
    </div>
  </div>
  </nav>
  )
}

export default Header;