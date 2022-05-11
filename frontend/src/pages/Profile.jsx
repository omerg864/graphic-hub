import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import {useEffect, useState} from 'react';
import { getUser, updateFollow, reset as user_reset } from '../features/auth/authSlice';
import { getProjects, getMyProjects, accessViewProjects, reset } from '../features/projects/projectSlice';
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import ProjectItem from '../components/ProjectItem';
import ProfileData from '../components/ProfileData';
import { MdOutlineLibraryAdd } from 'react-icons/md';
import Pagination from '../components/Pagination';


function Profile() {

  const params = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {projects, private_projects, private_view_projects, isLoading, isSuccess, isError, message} = useSelector((state) => state.project);

  const user_state = useSelector((state) => state.auth);

  const { user, friend } = user_state;

  const message2 = user_state.message;

  const isLoading2 = user_state.isLoading;

  const isError2 = user_state.isError;

  const isSuccess2 = user_state.isSuccess;

  const [isUser, setIsUser] = useState(false);

  const [validToken, setValidToken] = useState(false);

  const [projectPages, setProjectPages] = useState(1);
  const [projectViewPages, setProjectViewPages] = useState(1);
  const [projectPrivatePages, setProjectPrivatePages] = useState(1);

  const goToNewProject = () => {
    navigate('/NewProject');
  }

  const validateToken = () => {
    const token = document.getElementById('view_token').value;
    const username = params.username;
    const query = getQuery();
    dispatch(accessViewProjects({
      token, 
      username,
      query,
      page: query.private_view_page ? query.private_view_page - 1 : 0,
    })).then((result) => {
      if (result.payload.success) {
        localStorage.setItem(`${username}_token`, token);
        setValidToken(true);
        setProjectViewPages(result.payload.pages);
        dispatch(reset());
      }
    });
  }

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

  const validateStorageToken = () => {
    const token = localStorage.getItem(`${params.username}_token`);
    const username = params.username;
    const query = getQuery();
    dispatch(accessViewProjects({token, username, query, page: query.private_view_page ? query.private_view_page - 1 : 0})).then((result) => {
      if (result.payload.success) {
        localStorage.setItem(`${username}_token`, token);
        setValidToken(true);
        setProjectViewPages(result.payload.pages);
      } else {
        localStorage.removeItem(`${username}_token`);
        setValidToken(false);
      }
    });
  }

  useEffect(() => {
    if (localStorage.getItem(`${params.username}_token`)) {
      validateStorageToken();
    }
  }, []);

  useEffect(() => {
    dispatch(getUser(params.username));
    const query = getQuery();
    console.log(query.projects_page - 1);
    dispatch(getProjects({username: params.username, orderBy: 'updatedAt', query, page: query.projects_page ? query.projects_page - 1 : 0})).then((result) => {
      if (result.payload.success) {
        setProjectPages(result.payload.pages);
      }
    });
    if (user) {
    if (user.username === params.username){
      setIsUser(true);
      dispatch(getMyProjects({
        visibility: 'private',
        query,
        page: query.private_projects_page ? query.private_projects_page - 1 : 0,
      })).then((result) => {
        if (result.payload.success) {
          setProjectPrivatePages(result.payload.pages);
        }
      });
      dispatch(getMyProjects({
        visibility: 'private view',
        query,
        page: query.private_view_page ? query.private_view_page - 1 : 0,
      })).then((result) => {
        if (result.payload.success) {
          setProjectViewPages(result.payload.pages);
        }
      });
    }
  }
  }, [dispatch, params, user]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
    }
    if (isSuccess2){
      dispatch(user_reset());
    }
  }, [isSuccess, isSuccess2]);


  useEffect(() => {
    if (isError){
      toast.error(message);
      dispatch(reset());
    }
    if (isError2){
      toast.error(message2);
      dispatch(user_reset());
    }
  }, [isError, isError2, message, message2]);

  if (isLoading || isLoading2) {
    return <Spinner />;
  }

  return (
    <>
    <div className='row-div'>
      <ProfileData friend={friend} user={user} isChat={false}/>
      <div className="container">
        <div className='space'>
        <h2>Projects</h2>
        {isUser && <button className='btn btn-success' style={{height: '40px'}} onClick={goToNewProject}><a><MdOutlineLibraryAdd  style={{color: 'white'}} /> New</a></button>}
        </div>
      <nav>
  <div className="nav nav-tabs" id="nav-tab" role="tablist">
    <button className="nav-link active" id="nav-public-tab" data-bs-toggle="tab" data-bs-target="#nav-public" type="button" role="tab" aria-controls="nav-public" aria-selected="true">Public</button>
    <button className="nav-link" id="nav-private-view-tab" data-bs-toggle="tab" data-bs-target="#nav-private-view" type="button" role="tab" aria-controls="nav-private-view" aria-selected="false">Private View</button>
    {isUser && <button className="nav-link" id="nav-private-tab" data-bs-toggle="tab" data-bs-target="#nav-private" type="button" role="tab" aria-controls="nav-private" aria-selected="false">Private</button>}
  </div>
</nav>
<div className="tab-content" id="nav-tabContent">
  <div className="tab-pane fade show active" id="nav-public" role="tabpanel" aria-labelledby="nav-public-tab">
  {projects.length > 0 ? projects.map(project => (
        <div key={project.id}>
          <ProjectItem key={project.id} project={project} isUser={isUser} top={false}/>
        </div>
      )) :  <div className='center-div'>
      <h3>No Public Projects</h3> 
      </div>}
      <Pagination pages={projectPages} queryPage={'projects_page'}/>
  </div>
  <div className="tab-pane fade" id="nav-private-view" role="tabpanel" aria-labelledby="nav-private-view-tab">
    {!isUser ? ( !validToken ? 
    <form>
      <div className="form-group">
        <label htmlhtmlFor="view_token">View Token</label>
        <input type="text" className="form-control" id="view_token"/>
      </div>
      <button type="button" className="btn btn-primary" onClick={validateToken}>View Projects</button>
    </form> : (
            <div>
            {private_view_projects.length > 0 ? private_view_projects.map(project => (
              <div key={project.id}>
              <ProjectItem key={project.id} project={project} isUser={isUser} top={false}/>
              </div> )) : <div className='center-div'>
                <h3>No Priavte view Projects</h3> 
                </div>}
                <Pagination pages={projectViewPages} queryPage={'private_view_page'}/>
            </div>
    )) : (
      <div>
        {private_view_projects.length > 0 ? private_view_projects.map(project => (
          <div key={project.id}>
          <ProjectItem key={project.id} project={project} isUser={isUser} top={false}/>
          </div> )) : <div className='center-div'>
            <h3>No Priavte view Projects</h3> 
            </div>}
            <Pagination pages={projectViewPages} queryPage={'private_view_page'}/>
        </div>
    )}
  </div>
  {isUser && <div className="tab-pane fade" id="nav-private" role="tabpanel" aria-labelledby="nav-private-tab">
    {private_projects.length > 0 ? private_projects.map(project => (
        <div key={project.id}>
          <ProjectItem key={project.id} project={project} isUser={isUser} top={false}/>
          </div> )) : <div className='center-div'>
            <h3>No Priavte Projects</h3> 
            </div> }
            <Pagination pages={projectPrivatePages} queryPage={'private_projects_page'}/>
  </div> }
</div>
      </div>
      </div>
    </>
  )
}

export default Profile