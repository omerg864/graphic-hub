import Spinner from '../components/Spinner';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getUser, getUserByid, reset as user_reset} from '../features/auth/authSlice';
import {getProjects, reset} from '../features/projects/projectSlice';
import {useParams, useNavigate, Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import ProjectItem from '../components/ProjectItem';


function Home() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {projects, project, top_projects, isLoading, isSuccess, isError, message} = useSelector((state) => state.project);

  const user_state = useSelector((state) => state.auth);

  const {user, friend} = user_state;
  const message2 = user_state.message;
  const isLoading2 = user_state.isLoading;
  const isError2 = user_state.isError;
  const isSuccess2 = user_state.isSuccess;

  useEffect(() => {
    dispatch(getProjects({orderBy: 'likes', type: 'top'}));
    if (user) {
    dispatch(getProjects({orderBy: 'UpdatedAt', type: 'follow', following: user.following}));
    }
  }, [dispatch, project]);

  useEffect(() => {
    if (isSuccess){
      dispatch(reset());
    }
    if (isSuccess2) {
      dispatch(user_reset());
    }
  }, [isSuccess, isSuccess2]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isError2){
      toast.error(message2);
      dispatch(user_reset());
    }

  }, [isError, isError2, message, message2, dispatch]);

  const switchToFollowing = () => {
    var top_tab = document.getElementById('v-pills-top-tab');
    top_tab.classList.remove('active');
    top_tab.ariaSelected = false;
    var following_tab = document.getElementById('v-pills-follow-tab');
    following_tab.classList.add('active');
    following_tab.ariaSelected = true;
    var following_content = document.getElementById('v-pills-follow');
    following_content.classList.add('show');
    following_content.classList.add('active');
    var top_content = document.getElementById('v-pills-top');
    top_content.classList.remove('show');
    top_content.classList.remove('active');
  }

  const switchToTop = () => {
    var top_tab = document.getElementById('v-pills-top-tab');
    top_tab.classList.add('active');
    top_tab.ariaSelected = true;
    var following_tab = document.getElementById('v-pills-follow-tab');
    following_tab.classList.remove('active');
    following_tab.ariaSelected = false;
    var following_content = document.getElementById('v-pills-follow');
    following_content.classList.remove('show');
    following_content.classList.remove('active');
    var top_content = document.getElementById('v-pills-top');
    top_content.classList.add('show');
    top_content.classList.add('active');
  }



  if (isLoading2 || isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div class="d-flex align-items-start">
        <div>
  <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
    <button class="nav-link active" id="v-pills-top-tab" data-bs-toggle="pill" data-bs-target="#v-pills-top" type="button" onClick={switchToTop} role="tab" aria-controls="v-pills-top" aria-selected="true">Top Projects</button>
    <button class="nav-link" id="v-pills-follow-tab" data-bs-toggle="pill" data-bs-target="#v-pills-follow" type="button" onClick={switchToFollowing} role="tab" aria-controls="v-pills-follow" aria-selected="false">Following</button>
  </div>
  </div>
  <div class="tab-content" id="v-pills-tabContent" style={{width: '100%'}}>
    <div class="tab-pane fade show active" id="v-pills-top" role="tabpanel" aria-labelledby="v-pills-top-tab" style={{width: '100%'}}>
      <div >
      <h2>Top Projects</h2>
      <p>Most Liked Projects</p>
      {top_projects.map((project) => (
          user && project.user._id === user._id ? (
        <ProjectItem key={project.id} project={project} isUser={true} top={true}/>
          ) : !user ? (
            <ProjectItem key={project.id} project={project} isUser={true} top={true}/>
          ) :  (
            <ProjectItem key={project.id} project={project} isUser={false} top={true}/>
          )
      ))}
      </div>
    </div>
    <div class="tab-pane fade" id="v-pills-follow" role="tabpanel" aria-labelledby="v-pills-follow-tab">
      {user ? (
        <div>
        <h2>Following </h2>
        <p>Latest Project of pepole you follow</p>
        {projects.map((project) => (
          <ProjectItem key={project.id} project={project} isUser={false} top={false}/>
        ))}
        </div>
      ): (<h2><Link to="/login">Login</Link> or <Link to="/register">Register</Link> to view followings projects</h2>)}
    </div>
  </div>
</div>
    </>
  )
}

export default Home