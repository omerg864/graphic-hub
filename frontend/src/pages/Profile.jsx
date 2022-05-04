import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import {useEffect, useState} from 'react';
import { getUser, updateFollow } from '../features/auth/authSlice';
import { getProjectsByUser, getPrivateProjects } from '../features/projects/projectSlice';
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaUserFriends } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import ProjectItem from '../components/ProjectItem';
import ProfileData from '../components/ProfileData';


function Profile() {

  const params = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {projects, private_projects, private_view_projects, isLoading, isSuccess, isError, message} = useSelector((state) => state.project);

  const { user, friend, isSuccess2, isError2, isLoading2, message2} = useSelector((state) => state.auth);

  const [isUser, setIsUser] = useState(false);

  const [isFollowed, setIsFollowed] = useState(false);

  const goTOChat = () => {
    navigate(`/chat/${params.username}`);
  }

  const follow = () => {
    dispatch(updateFollow(params.username));
    setIsFollowed(!isFollowed);
  }

  const switchToPrivateView = () => {
    document.getElementById('nav-private-view-tab').classList.add('active');
    document.getElementById('nav-public-tab').classList.remove('active');
    document.getElementById('nav-public').classList.remove('show');
    document.getElementById('nav-public').classList.remove('active');
    document.getElementById('nav-private-view').classList.add('show');
    document.getElementById('nav-private-view').classList.add('active');
    document.getElementById('nav-private-tab').classList.remove('active');
    document.getElementById('nav-private').classList.remove('show');
    document.getElementById('nav-private').classList.remove('active');
  }

  const switchToPublic = () => {
    document.getElementById('nav-private-view-tab').classList.remove('active');
    document.getElementById('nav-public-tab').classList.add('active');
    document.getElementById('nav-public').classList.add('show');
    document.getElementById('nav-public').classList.add('active');
    document.getElementById('nav-private-view').classList.remove('show');
    document.getElementById('nav-private-view').classList.remove('active');
    document.getElementById('nav-private-tab').classList.remove('active');
    document.getElementById('nav-private').classList.remove('show');
    document.getElementById('nav-private').classList.remove('active');
  }

  const switchToPrivate = () => {
    document.getElementById('nav-private-view-tab').classList.remove('active');
    document.getElementById('nav-public-tab').classList.remove('active');
    document.getElementById('nav-public').classList.remove('show');
    document.getElementById('nav-public').classList.remove('active');
    document.getElementById('nav-private-view').classList.remove('show');
    document.getElementById('nav-private-view').classList.remove('active');
    document.getElementById('nav-private-tab').classList.add('active');
    document.getElementById('nav-private').classList.add('show');
    document.getElementById('nav-private').classList.add('active');
  }

  useEffect(() => {
    if (isError){
      toast.error(message);
    }
    if (isError2){
      toast.error(message2);
    }
    dispatch(getPrivateProjects());
    dispatch(getUser(params.username));
    dispatch(getProjectsByUser(params.username));
    if (user.username === params.username){
      setIsUser(true);
    }
    if (user.following.includes(params.username)){
      setIsFollowed(true);
    }
  }, [dispatch, params, isError, message, isError2, message2, user, setIsFollowed]);

  if (isLoading || isLoading2) {
    return <Spinner />;
  }

  return (
    <>
    <div className='row-div'>
      <ProfileData friend={friend} user={user} isChat={false}/>
      <div className="container">
      <h2>Projects</h2>
      <nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist">
    <button class="nav-link active" id="nav-public-tab" onClick={switchToPublic} data-bs-toggle="tab" data-bs-target="#nav-public" type="button" role="tab" aria-controls="nav-public" aria-selected="true">Public</button>
    <button class="nav-link" onClick={switchToPrivateView} id="nav-private-view-tab" data-bs-toggle="tab" data-bs-target="#nav-private-view" type="button" role="tab" aria-controls="nav-private-view" aria-selected="false">Private View</button>
    {isUser && <button class="nav-link" id="nav-private-tab" onClick={switchToPrivate} data-bs-toggle="tab" data-bs-target="#nav-private" type="button" role="tab" aria-controls="nav-private" aria-selected="false">Private</button>}
  </div>
</nav>
<div class="tab-content" id="nav-tabContent">
  <div class="tab-pane fade show active" id="nav-public" role="tabpanel" aria-labelledby="nav-public-tab">
  {projects.length > 0 ? projects.map(project => (
        <div key={project.id}>
          <ProjectItem key={project.id} project={project} isUser={isUser}/>
        </div>
      )) :  <div className='center-div'>
      <h3>No Public Projects</h3> 
      </div>}
  </div>
  <div class="tab-pane fade" id="nav-private-view" role="tabpanel" aria-labelledby="nav-private-view-tab">
    <form>
      <div className="form-group">
        <label htmlFor="view_token">View Token</label>
        <input type="text" className="form-control" id="view_token"/>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  </div>
  {isUser && <div class="tab-pane fade" id="nav-private" role="tabpanel" aria-labelledby="nav-private-tab">
    {private_projects.length > 0 ? private_projects.map(project => (
        <div key={project.id}>
          <ProjectItem key={project.id} project={project} isUser={isUser}/>
          </div> )) : <div className='center-div'>
            <h3>No Priavte Projects</h3> 
            </div> }
  </div> }
</div>
      </div>
      </div>
    </>
  )
}

export default Profile