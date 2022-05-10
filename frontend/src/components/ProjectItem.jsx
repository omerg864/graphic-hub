import { useNavigate, useParams } from 'react-router-dom';
import {AiFillLike, AiOutlineLike} from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { updateProject, reset } from '../features/projects/projectSlice';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

function ProjectItem({ project, isUser, top }) {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const gotoProject = () => {
        navigate(`/${project.user.username}/${project.name}`);
    }
    const { user } = useSelector((state) => state.auth);

    const [isLiked, setIsLiked] = useState(false);

    const [likes, setLikes] = useState(0);

    const {projects, isLoading, isSuccess, isError, message} = useSelector((state) => state.project);

    useEffect(() => {
        if (user){
        if (project.likes.includes(user.username)) {
            setIsLiked(true);
        }
    }
        setLikes(project.likes.length);
    }, []);

    useEffect(() => {
        if (user){
        if (project.likes.includes(user.username)) {
            setIsLiked(true);
        }
    }
        setLikes(project.likes.length);
    }, [project, user, setIsLiked, setLikes]);

    const unLikelikeProject = () => {
        dispatch(updateProject({
                id: project._id,
                content: {},
                type: top ? 'top' : 'project'
        }));
        setLikes(project.likes.length);
        setIsLiked(!isLiked);
        dispatch(reset());
    }

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString();
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
                {user && !isUser ? isLiked ? <button onClick={unLikelikeProject} style={{marginBottom: '5px'}} className="btn"><AiFillLike style={{color: '#0d6efd'}}/></button> :
                 <button onClick={unLikelikeProject} style={{marginBottom: '5px'}} className="btn"><AiOutlineLike style={{color: '#0d6efd'}}/></button> : null}
                </div>
                </div>
                <pre className="card-text">Description: {project.description}</pre>
                <small>Owner: {project.user.username}</small>
                <div>
                <small>{project.images.length} Files</small>
                </div>
                <div className="space">
                <small className="card-text">Last Updated: {formatDate(project.updatedAt)}</small>
                <button className="btn btn-primary" onClick={gotoProject}>Open Project</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default ProjectItem