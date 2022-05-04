import { useNavigate, useParams } from 'react-router-dom';
import {AiFillLike, AiOutlineLike} from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { updateProject, reset } from '../features/projects/projectSlice';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

function ProjectItem({ project, isUser }) {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const gotoProject = () => {
        navigate(`/${params.username}/${project.name}`);
    }
    const { user } = useSelector((state) => state.auth);

    const [isLiked, setIsLiked] = useState(false);

    const [likes, setLikes] = useState(0);

    const {projects, isLoading, isSuccess, isError, message} = useSelector((state) => state.project);

    useEffect(() => {
        if (project.likes.includes(user.username)) {
            setIsLiked(true);
        }
        setLikes(project.likes.length);
    }, []);

    useEffect(() => {
        if (isError){
            toast.error(message);
        }
        if (project.likes.includes(user.username)) {
            setIsLiked(true);
        }
        setLikes(project.likes.length);
    }, [project, user, isError, message, setIsLiked, setLikes]);
    const unLikelikeProject = () => {
        dispatch(updateProject({
                id: project._id,
                content: {},
        }));
        setLikes(project.likes.length);
        setIsLiked(!isLiked);
        dispatch(reset());
    }

    if (isLoading) {
        return <Spinner />;
    }

  return (
    <>
        <div className="card">
            <div className="card-body">
                <div className="space">
                <div>
                <h3 className="card-title">{project.name}</h3>
                </div>
                <div>
                <small>{likes} Likes</small>
                {!isUser ? isLiked ? <button onClick={unLikelikeProject} style={{marginBottom: '5px'}} className="btn"><AiFillLike style={{color: '#0d6efd'}}/></button> :
                 <button onClick={unLikelikeProject} style={{marginBottom: '5px'}} className="btn"><AiOutlineLike style={{color: '#0d6efd'}}/></button> : null}
                </div>
                </div>
                <p className="card-text">{project.description}</p>
                <button className="btn btn-primary" onClick={gotoProject}>Open Project</button>
            </div>
        </div>
    </>
  )
}

export default ProjectItem