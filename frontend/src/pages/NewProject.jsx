import { createProject, reset } from '../features/projects/projectSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

function NewProject() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const { user } = useSelector((state) => state.auth);

    const {projects, project, isLoading, isSuccess, isError, message} = useSelector((state) => state.project);

    const checkProjectName = (e) => {
        if (e.target.value.length > 0) {

        }
    }

    const submitForm = () => {
        const name = document.getElementById('project-name').value;
        const description = document.getElementById('project-description').value;
        const visibility = document.getElementById('project_visibility1').checked && 'public' || document.getElementById('project_visibility2').checked && 'private' || document.getElementById('project_visibility3').checked && 'private view';
        const images = document.getElementById('project_images').files;
        const data = {
            name,
            description,
            visibility,
            images,
        }
        dispatch(createProject(data));
    }

    useEffect(() => {
        if (isSuccess) {
            navigate(`/${user.username}/`);
            toast.success("Project created successfully");
            dispatch(reset());
        }
    }, [isSuccess]);

    if (isLoading) {
        return <Spinner />;
    }
  return (
    <>
    <div className='center-div'>
    <div className="content-section" style={{width: 'fit-content'}}>
    <div className="center-div">
        <h1>Create New Project</h1>
        <form>
            <div class="mb-3">
                <p style={{fontWeight: '600'}}>Project Name</p>
        <input type="text" placeholder="Project Name" id="project-name" name="project-name" onChange={checkProjectName}/>
        </div>
        <div class="mb-3">
            <p style={{fontWeight: '600'}}>Project Description</p>
        <textarea placeholder="Project Description" style={{resize: 'both'}} id="project-description" name="project-description"/>
        </div>
        <div class="mb-3">
        <p style={{fontWeight: '600'}}>Images</p>
        <input type="file" id="project_images" multiple name="project_images" />
        </div>
        <p style={{fontWeight: '600'}}>Project Visibility</p>
        <div class="form-check">
        <input class="form-check-input" type="radio" name="project_visibility" id="project_visibility1" checked/>
        <label class="form-check-label" for="project_visibility1">
            Public
        </label>
        </div>
        <div class="form-check">
        <input class="form-check-input" type="radio" name="project_visibility" id="project_visibility2"/>
        <label class="form-check-label" for="project_visibility2">
            Private
        </label>
        </div>
        <div class="form-check">
        <input class="form-check-input" type="radio" name="project_visibility" id="project_visibility3"/>
        <label class="form-check-label" for="project_visibility3">
            Private View
        </label>
        </div>
        <div style={{marginTop: '10px'}}>
        <button className="btn btn-primary" type="button" onClick={submitForm}>Create</button>
        </div>
        </form>
        </div>
        </div>
        </div>
    </>
  )
}

export default NewProject