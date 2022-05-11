import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/Spinner';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getViewTokens, deleteViewToken, reset as token_reset } from '../features/viewTokens/viewTokenSlice';
import { reset, updateUser } from '../features/auth/authSlice';
import { GiToken } from 'react-icons/gi';
import {BsTrash} from 'react-icons/bs';
import { TiEdit } from 'react-icons/ti';
import Pagination from '../components/Pagination';


function Settings() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    f_name: '',
    l_name: '',
    email: '',
    info: '',
    company: '',
  });

  const [Tokenpages, setTokenpages] = useState(1);

  const view_tokens_state = useSelector((state) => state.viewToken);
  const viewTokens = view_tokens_state.viewTokens;
  const isLoading2 = view_tokens_state.isLoading;
  const isError2 = view_tokens_state.isError;
  const isSuccess2 = view_tokens_state.isSuccess;
  const message2 = view_tokens_state.message;

  useEffect(() => {
    if (user) {
      const query = getQuery();
    dispatch(getViewTokens({...query, page: query.page ? query.page - 1 : 0 })).then((result) => {
      if (result.payload.success){
        setTokenpages(result.payload.pages);
      }
    });
    setUserData({
      f_name: user.f_name,
      l_name: user.l_name,
      email: user.email,
      info: user.info,
      company: user.company,
    });
  }
  }, []);

  const getQuery = () => {
    let search = window.location.search;
    let query = search.replace('?', '').split('&');
    let query_obj = {};
    query.forEach((item) => {
      let key = item.split('=')[0];
      let value = item.split('=')[1];
      if (key.includes('page')) {
        query_obj[key] = parseInt(value);
      } else{
        query_obj[key] = value;
      }
    });
    console.log(query_obj);
    if (!query_obj.page) {
      query_obj.page = 0;
    }
    return query_obj;
  }

  const dataChange = (e) => {
    setUserData((prevState) => ({
      ...prevState, [e.target.name] : e.target.value,
  })
  )
  }

  const formatDate = (date) => {
    const d = new Date(date);
    if (d.getFullYear() === 9999){
      return 'Never';
    }
    return d.toLocaleDateString();
  }

  const goToNewToken = () => {
    navigate('/NewToken');
  }

  const goToEditToken = (id) => {
    navigate(`/EditToken/${id}`);
  }

  const deleteToken = (id) => {
    dispatch(deleteViewToken(id));
  }

  const saveUser = () => {
    var image = document.getElementById('image').files[0];
    if (image) {
    dispatch(updateUser({...userData, img_url: image, image: true, deleteImage: user.img_url ? user.img_url : ""}));
    } else {
      var deleteImage = document.getElementById('deleteimage')
      if (!deleteImage) {
        dispatch(updateUser({...userData ,image: false, img_url: user.img_url}));
      } else {
        if (deleteImage.checked) {
          dispatch(updateUser({...userData, deleteImage: user.img_url, img_url: ""}));
        } else {
          dispatch(updateUser({...userData ,image: false}));
        }
      }
    }
    toast.success('User data updated');
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
    }
    if (isSuccess2){
      dispatch(token_reset());
    }
  }, [isSuccess, isSuccess2]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isError2) {
      toast.error(message2);
    }
  }, [isError, message, message2, isError2]);

  if (isLoading || isLoading2) {
    return <Spinner />;
  }

  return (
    <>
    {user ? (<>
      <h1>Settings</h1>
      <div className="d-flex align-items-start">
      <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        <button className="nav-link active" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="true">Profile</button>
        <button className="nav-link" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="false">Tokens</button>
      </div>
        <div className="tab-content" id="v-pills-tabContent" style={{width: '100%'}}>
        <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" >
          <div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Profile</h5>
              <div className="form-group">
                  <label htmlFor="exampleInputFName">First Name</label>
                  <input type="text" className="form-control" id="f_name" placeholder="First Name" value={userData.f_name} name="f_name" onChange={dataChange} />
                  </div>
                  <div className="form-group">
                  <label htmlFor="exampleInputLName">Last Name</label>
                  <input type="text" className="form-control" id="l_name" name='l_name' placeholder="Last Name" value={userData.l_name} onChange={dataChange} />
                  </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail">Email address</label>
                  <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" value={userData.email} onChange={dataChange} />
                  </div>
                  <div className="form-group">
                  <label htmlFor="exampleInputUsername">Username</label>
                  <input type="text" className="form-control" id="username" name="username" placeholder="Username" value={userData.username} onChange={dataChange} />
                  </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword">Password</label>
                  <input type="password" className="form-control" id="password" name="password" placeholder="Password" />
                  </div>
                  <div className="form-group">
                  <label htmlFor="exampleInputBio">Bio</label>
                  <textarea className="form-control" id="info" name="info" placeholder="Bio" value={userData.info} onChange={dataChange} />
                  </div>
                  <div className="form-group">
                  <label htmlFor="exampleInputCompany">Company</label>
                  <input type="text" className="form-control" id="company" name="company" placeholder="Company" value={userData.company} onChange={dataChange} />
                  </div>
                  <div className="form-group">
                  <label htmlFor="exampleInputPicture">Profile Picture</label>
                  {user.img_url ? (<div className="image-container">
                     <a>Current Picture: </a>
                     <img src={user.img_url} alt="profile" className="img-thumbnail" style={{width: '100px', height: '100px'}} />
                     <div className="switch-image">
                        <label className="switch">
                        <input type="checkbox" className="switch-input" id={`deleteimage`} name={`deleteimage`}/>
                        <span className="switch-label" data-on="On" data-off="Off"><BsTrash className="trash-label"/></span>
                        <span className="switch-handle"></span>
                        </label>
                        </div>
                     </div>) : <a>: No Profile picture uploaded</a>}
                  <input type="file" className="form-control" id="image" name="image" />
                  </div>
                <div style={{marginTop: '20px'}}>
                  <button type="button" className="btn btn-primary" onClick={saveUser}>Save</button>
                </div>
                </div>
                </div>
                </div>
        </div>
          <div className="tab-pane fade" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
          <div className="card">
          <div className="card-body">
            <div className='space'>
              <h5 className="card-title">Tokens</h5>
              <button className="btn btn-success" type='button' onClick={goToNewToken}><GiToken /> New</button>
              </div>
              <div style={{marginTop: '20px'}}>
              {viewTokens.map((token) => (
                <div className='card' key={token.id} style={{marginBottom: '10px', padding: '10px'}}>
                    <h4>{token.name}</h4>
                  <div className="form-group">
                    <input type="text" className="form-control" name="token" placeholder="Token" value={token.token} disabled />
                  </div>
                  <div className="form-group">
                    <a>Token expire date: {formatDate(token.expires)}</a>
                  </div>
                  <div className='space' style={{marginTop: '10px'}}>
                    <button className="btn btn-primary" type='button' onClick={() => goToEditToken(token._id)}><TiEdit /> Edit</button>
                    <button className="btn btn-danger" type='button' onClick={() => deleteToken(token._id)}><BsTrash /> Delete</button>
                  </div>
                  </div>
              ))}
              <Pagination pages={Tokenpages} queryPage="page" />
              </div>
              </div>
          </div>
          </div>
        </div>
      </div>
    </>) 
    : (<h2><Link to="/login">Login</Link> or <Link to="/register">Register</Link> to access your settings</h2>)}
      
    </>
  )
}

export default Settings