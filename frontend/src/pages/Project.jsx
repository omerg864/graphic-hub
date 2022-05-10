import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import {useEffect, useState, useCallback} from 'react';
import { getUser, reset as user_reset } from '../features/auth/authSlice';
import { getProjects, getProject, updateProject, accessViewProject, reset } from '../features/projects/projectSlice';
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import ImageViewer from "react-simple-image-viewer";
import ProfileData from '../components/ProfileData';
import {AiFillLike, AiOutlineLike} from 'react-icons/ai';
import { TiEdit } from 'react-icons/ti';
import { MdPublic, MdLockOutline, MdLockOpen } from 'react-icons/md';
import { useNavigate } from "react-router-dom";


function Project() {

  const params = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const {projects, project, isLoading, isSuccess, isError, message} = useSelector((state) => state.project);

  const user_state = useSelector((state) => state.auth);

  const { user, friend } = user_state;

  const message2 = user_state.message;

  const isLoading2 = user_state.isLoading;

  const isError2 = user_state.isError;

  const isSuccess2 = user_state.isSuccess;

  const [isLiked, setIsLiked] = useState(false);

  const [likes, setLikes] = useState(0);

  const [isUser, setIsUser] = useState(false);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const unLikelikeProject = () => {
    dispatch(updateProject({
            id: project._id,
            content: {},
    }));
    setIsLiked(!isLiked);
    setLikes(project.likes.length);
    dispatch(reset());
}

const goToEdit = () => {
  navigate(`/${params.username}/${params.project}/edit`);
}

  useEffect(() => {
    dispatch(getProject({
      name: params.project,
      username: params.username})).then((result) => {
        console.log(result);
          if (result.meta.requestStatus === 'rejected') {
            if (localStorage.getItem(`${params.username}_token`)) {
              dispatch(accessViewProject({
                name: params.project,
                username: params.username,
                token: localStorage.getItem(`${params.username}_token`)
              })).then((result) => {
                  if (result.payload.success) {
                    toast.success("But Now i see the Token so welcome");
                  }
                }
              );
            }
        }
      }
      );
    dispatch(getUser(params.username));
    dispatch(getProjects({username: params.username}));
    if (user) {
        if (user.username === params.username){
          setIsUser(true);
        }
      }
  }, [dispatch, params, setIsLiked, setLikes, user]);

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

  useEffect(() => {
    if (user) {
    if (project.likes.includes(user.username)) {
      setIsLiked(true);
    }
  }
    setLikes(project.likes.length);
  }, [project]);

  if (isLoading || isLoading2) {
    return <Spinner />;
  }

  return (
    <>
    <div className="row-div">
    <div style={{marginRight: '10px'}}>
      <h2>Author Details</h2>
      <ProfileData friend={friend} user={user} isChat={false}/>
    </div>
        <div style={{width: "100%"}}>
          {isUser ? <div className='space' style={{width: "100%"}}>
            <div></div>
            <div>
            <h1>Project {project.visibility === 'public' ? <MdPublic /> : project.visibility === 'private' ? <MdLockOutline /> : <MdLockOpen /> }</h1>
            </div>
          <button type='button' className='btn btn-primary' onClick={goToEdit}><TiEdit /> Edit</button>
          </div> : <div className='center-div'><h1>Project {project.visibility === 'public' ? <MdPublic /> : project.visibility === 'private' ? <MdLockOutline /> : <MdLockOpen /> }</h1></div>}
          <div className='space' style={{width: "100%"}}>
            <div></div>
            <h2>{project.name}</h2>
            {isUser ? <div style={{width : "60px"}}></div> : <div></div>}
          </div>
          <div className='space' style={{width: "100%"}}>
        <pre style={{marginBottom: '20px'}}>{project.description}</pre>
        <div>
                <small>{likes} Likes</small>
                {user && !isUser ? isLiked ? <button onClick={unLikelikeProject} className="btn"><AiFillLike style={{color: '#0d6efd'}}/></button> :
                 <button onClick={unLikelikeProject} className="btn"><AiOutlineLike style={{color: '#0d6efd'}}/></button> : null}
                </div>
          </div>
        <div className='center-div' style={{marginBottom: '30px'}}>
        <h3>Project Images</h3>
        </div>
        {project.images.length > 0 ?
        <div className='content-section'>
      {project.images.map((src, index) => (
        <img
          src={src}
          onClick={() => openImageViewer(index)}
          key={index}
          width="300"
          style={{ margin: "2px" }}
          alt=""
        />
      ))}
      </div> : <div className='center-div'>
        <h3>No images in this project</h3>
        </div>}

      {isViewerOpen && (
        <ImageViewer
          src={project.images}
          currentIndex={currentImage}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)"
          }}
          closeOnClickOutside={true}
        />
      )}
    </div>
    </div>
    </>
  )
}

export default Project