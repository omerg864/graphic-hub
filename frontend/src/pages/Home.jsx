import Spinner from '../components/Spinner';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getUser, reset as user_reset} from '../features/auth/authSlice';
import {getProjects, reset} from '../features/projects/projectSlice';
import {useParams, useNavigate, Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import ProjectItem from '../components/ProjectItem';
import Pagination from '../components/Pagination';


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

  const [toppages, setTopPages] = useState(1);

  const [followpages, setFollowPages] = useState(1);

  useEffect(() => {
    let query_obj = getQuery();
    dispatch(getProjects({...query_obj ,orderBy: 'likes', type: 'top'})).then((result) => {
      if (result.payload.success) {
        setTopPages(result.payload.pages);
      }
    });
    if (user) {
    dispatch(getProjects({...query_obj, orderBy: 'UpdatedAt', type: 'follow', following: user.following})).then((result) => {
      if (result.payload.success) {
        setFollowPages(result.payload.pages);
      }
    });
    }
  }, [dispatch, project]);

  const getQuery = () => {
    let search = window.location.search;
    let query = search.replace('?', '').split('&');
    let query_obj = {};
    query.forEach((item) => {
      let key = item.split('=')[0];
      let value = item.split('=')[1];
      if (key === 'page') {
        query_obj[key] = parseInt(value) - 1;
      }
    });
    console.log(query_obj);
    if (!query_obj.page) {
      query_obj.page = 0;
    }
    return query_obj;
  }

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

  const getArray = (pages) => {
    let array = [];
    for (let i = 1; i <= pages; i++) {
      array.push(i);
    }
    return array;
  }



  if (isLoading2 || isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="d-flex align-items-start">
        <div>
  <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
    <button className="nav-link active" id="v-pills-top-tab" data-bs-toggle="pill" data-bs-target="#v-pills-top" type="button" role="tab" aria-controls="v-pills-top" aria-selected="true">Top Projects</button>
    <button className="nav-link" id="v-pills-follow-tab" data-bs-toggle="pill" data-bs-target="#v-pills-follow" type="button" role="tab" aria-controls="v-pills-follow" aria-selected="false">Following</button>
  </div>
  </div>
  <div className="tab-content" id="v-pills-tabContent" style={{width: '100%'}}>
    <div className="tab-pane fade show active" id="v-pills-top" role="tabpanel" aria-labelledby="v-pills-top-tab" style={{width: '100%'}}>
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
      <Pagination pages={toppages} />
    </div>
    <div className="tab-pane fade" id="v-pills-follow" role="tabpanel" aria-labelledby="v-pills-follow-tab">
      {user ? (
        <div>
        <h2>Following </h2>
        <p>Latest Project of pepole you follow</p>
        {projects.map((project) => (
          <ProjectItem key={project.id} project={project} isUser={false} top={false}/>
        ))}
        <Pagination pages={followpages} />
        </div>
      ): (<h2><Link to="/login">Login</Link> or <Link to="/register">Register</Link> to view followings projects</h2>)}
    </div>
  </div>
</div>
    </>
  )
}

export default Home