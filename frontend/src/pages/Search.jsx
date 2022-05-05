import {useParams, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Spinner from '../components/Spinner';
import {useEffect, useState} from 'react';
import {searchUser, getUserByid} from '../features/auth/authSlice';
import { searchProjects } from '../features/projects/projectSlice';
import ProjectItem from '../components/ProjectItem';




function Search() {
  
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [usersFound, setUsersFound] = useState([]);
  const [projectsFound, setProjectsFound] = useState([]);

  const {user, isLoading, isSuccess, isError, message} = useSelector((state) => state.auth);
  const project_state = useSelector((state) => state.project);

  const isLoading2 = project_state.isLoading;

  useEffect(() => {
    dispatch(searchUser(params.searchKey)).then(result => {
      setUsersFound(result.payload.users)
    });
    dispatch(searchProjects(params.searchKey)).then(result => {
      setProjectsFound(result.payload.projects)
    });
  }, [dispatch, params]);

  const switchToProjects = () => {
    document.getElementById('nav-users-tab').classList.remove('active');
    document.getElementById('nav-users').classList.remove('show');
    document.getElementById('nav-users').classList.remove('active');
    document.getElementById('nav-projects-tab').classList.add('active');
    document.getElementById('nav-projects').classList.add('show');
    document.getElementById('nav-projects').classList.add('active');
  }

  const switchToUsers = () => {
    document.getElementById('nav-users-tab').classList.add('active');
    document.getElementById('nav-users').classList.add('show');
    document.getElementById('nav-users').classList.add('active');
    document.getElementById('nav-projects-tab').classList.remove('active');
    document.getElementById('nav-projects').classList.remove('show');
    document.getElementById('nav-projects').classList.remove('active');
  }

  const goToProfile = (username) => {
    navigate(`/${username}`);
  }

  const goToProject = (name, user) => {
    navigate(`/${user.username}/${name}`);
  }

  if (isLoading || isLoading2) {
    return <Spinner />;
  }

  return (
    <>
    <div className="container">
      <h2>Search resaults For: {params.searchKey}</h2>
    <nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist">
    <button class="nav-link active" id="nav-users-tab" onClick={switchToUsers} data-bs-toggle="tab" data-bs-target="#nav-users" type="button" role="tab" aria-controls="nav-users" aria-selected="true">Users</button>
    <button class="nav-link" onClick={switchToProjects} id="nav-projects-tab" data-bs-toggle="tab" data-bs-target="#nav-projects" type="button" role="tab" aria-controls="nav-projects" aria-selected="false">Projects</button>
  </div>
</nav>
<div class="tab-content" id="nav-tabContent">
  <div class="tab-pane fade show active" id="nav-users" role="tabpanel" aria-labelledby="nav-users-tab">
    {usersFound.length > 0 ? usersFound.map(user => (
              <div className="card">
              <div className="card-body">
                  <div className="space">
                  <h3 className="card-title">{user.f_name} {user.l_name}</h3>
                  <button className="btn btn-primary" onClick={() => goToProfile(user.username)}>Go to Profile</button>
                  </div>
                  <div>
                  <a>{user.username}</a>
                  </div>
                  <p>{user.intro}</p>
                  <small>{user.email}</small>
                  <div>
                  <small>{user.company}</small>
                  </div>
              </div>
          </div>)) : <div className="center-div"><h4>No users found</h4></div>}
  </div>
  <div class="tab-pane fade" id="nav-projects" role="tabpanel" aria-labelledby="nav-projects-tab">
    {projectsFound.length > 0 ? projectsFound.map(project => (
      user && project.user._id === user._id ? (
        <ProjectItem key={project.id} project={project} isUser={true} top={false}/>
          ) : !user ? (
            <ProjectItem key={project.id} project={project} isUser={true} top={false}/>
          ) :  (
            <ProjectItem key={project.id} project={project} isUser={false} top={false}/>
          )
      )): <div className="center-div"><h4>No projects found</h4></div>}
  </div>
  </div>
      </div>
    </>
  )
}

export default Search