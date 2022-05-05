import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import {useEffect, useState, useCallback} from 'react';
import { getUser, reset as user_reset } from '../features/auth/authSlice';
import { getProjects, getProject, updateProject, reset } from '../features/projects/projectSlice';
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import ImageViewer from "react-simple-image-viewer";
import ProfileData from '../components/ProfileData';
import {AiFillLike, AiOutlineLike} from 'react-icons/ai';


function Project() {

  const params = useParams();

  const dispatch = useDispatch();

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const {projects, project, isLoading, isSuccess, isError, message} = useSelector((state) => state.project);

  const user_state = useSelector((state) => state.auth);

  const { user, friend } = user_state;

  const message2 = user_state.message;

  const isLoading2 = user_state.isLoading;

  const isError2 = user_state.isError;

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

  useEffect(() => {
    dispatch(getProject({
      name: params.project,
      username: params.username}))
    dispatch(getUser(params.username));
    dispatch(getProjects({username: params.username}));
        if (user.username === params.username){
          setIsUser(true);
        }
  }, [dispatch, params, setIsLiked, setLikes, user]);

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
    if (project.likes.includes(user.username)) {
      setIsLiked(true);
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
          <div className='center-div' style={{marginBottom: '10px'}}>
            <h1>Project</h1>
        <h2>{project.name}</h2>
        </div>
        <div className='end-div'>
                <small style={{marginBottom: '10px'}}>{likes} Likes</small>
                {!isUser ? isLiked ? <button onClick={unLikelikeProject} style={{marginBottom: '5px'}} className="btn"><AiFillLike style={{color: '#0d6efd'}}/></button> :
                 <button onClick={unLikelikeProject} style={{marginBottom: '5px'}} className="btn"><AiOutlineLike style={{color: '#0d6efd'}}/></button> : null}
                </div>
        <p style={{marginBottom: '20px'}}>{project.description}</p>
        <div className='center-div' style={{marginBottom: '30px'}}>
        <h3>Project Images</h3>
        </div>
        {project.images.length > 0 ?
        <div className='content-section'>
      {project.images.map((src, index) => (
        <img
          src={src}
          onClick={() => openImageViewer(index)}
          width="300"
          key={index}
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