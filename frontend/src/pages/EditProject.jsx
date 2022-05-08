import Spinner from "../components/Spinner";
import { useEffect, useState } from "react";
import { getProject, updateProject, reset, deleteProject } from "../features/projects/projectSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { BsTrash } from "react-icons/bs";


function EditProject() {

    const { project, isLoading, isSuccess, isError, message } = useSelector((state) => state.project);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const [isUser, setIsUser] = useState(false);

    const { user } = useSelector((state) => state.auth);

    const [projectName, setProjectName] = useState("");

    const [projectDescription, setProjectDescription] = useState("")


    const changeProject = async () => {
        console.log("asfasfasf")
        const name = document.getElementById("project-name").value;
        const description = document.getElementById("project-description").value;
        var images = [];
        var deleteimages = [];
        for (let i = 0; i < project.images.length; i++) {
            var image_check = document.getElementById('deleteimage' + i).checked;
            if (!image_check) {
                images.push(project.images[i]);
            } else {
                deleteimages.push(project.images[i]);
            }
        }
        const visibility = document.getElementById('project_visibility1').checked && 'public' || document.getElementById('project_visibility2').checked && 'private' || document.getElementById('project_visibility3').checked && 'private view';
        const new_images = document.getElementById('project_images').files;
        dispatch(updateProject({
            id: project._id,
            content: {
                name,
                description,
                images,
                visibility,
                new_images,
                deleteimages,
            },
            type: 'change'
        })).then((result) => {
            if (result.payload.success) {
                navigate(`/${user.username}/${project.name}`);
            }
        });
}

    const deletethisProject = () => {
        dispatch(deleteProject(project._id.toString()));
        navigate(`/${user.username}`);
        toast.success("Project deleted successfully");
    }

    const changeName = (e) => {
        setProjectName(e.target.value);
    }

    const changeDescription = (e) => {
        setProjectDescription(e.target.value);
    }

    useEffect(() => {
        dispatch(getProject({
            name: params.project,
            username: params.username}))
    }, []);

    useEffect(() => {
        if (isSuccess) {
            if (user._id.toString() === project.user._id.toString()) {
                setIsUser(true);
            }
            setProjectName(project.name);
            setProjectDescription(project.description);
            dispatch(reset());
        }
    }, [isSuccess]);

    if (isLoading) {
        return <Spinner />;
    }

  return (
    <>
    {isUser ? (
        <>
        <div className="content-section">
            <div className="center-div">
            <h1>Edit Section</h1>
            </div>
            <div>
        <p style={{fontWeight: '600'}}>Project Name</p>
        <input type="text" placeholder="Project Name" id="project-name" name="project-name" onChange={changeName} value={projectName} />
        </div>
        <div style={{marginTop: '10px'}}>
        <p style={{fontWeight: '600'}}>Project Description</p>
        <textarea name="project-description" id="project-description" placeholder="Description" value={projectDescription} onChange={changeDescription} style={{resize: 'both', width: '100%', height: '80px'}}></textarea>
        </div>
        <div>
            <p style={{fontWeight: '600'}}>Images</p>
            <div className="row-div">
                {project.images.map((image, index) => {
                    return (
                        <div className="image-container">
                        <img src={image} alt="project" style={{width: '100px', height: '100px'}} />
                        <div className="switch-image">
                        <label class="switch">
                        <input type="checkbox" class="switch-input" id={`deleteimage${index}`} name={`deleteimage${index}`}/>
                        <span class="switch-label" data-on="On" data-off="Off"><BsTrash className="trash-label"/></span>
                        <span class="switch-handle"></span>
                        </label>
                        </div>
                        </div>
                    )
                })}
                <input style={{marginTop: '40px'}} type="file" multiple id="project_images" name="project_images" />
            </div>
        </div>
        <div>
        <p style={{fontWeight: '600'}}>Project Visibility</p>
        </div>
        <div class="form-check">
            {project.visibility == 'public' ? (<input class="form-check-input" type="radio" name="project_visibility" id="project_visibility1" checked />) :
             (<input class="form-check-input" type="radio" name="project_visibility" id="project_visibility1" />)}
        <label class="form-check-label" for="project_visibility1">
            Public
        </label>
        </div>
        <div class="form-check">
            {project.visibility == 'private' ? (<input class="form-check-input" type="radio" name="project_visibility" id="project_visibility2" checked/>) : 
            (<input class="form-check-input" type="radio" name="project_visibility" id="project_visibility2" />)}
        <label class="form-check-label" for="project_visibility2">
            Private
        </label>
        </div>
        <div class="form-check">
            {project.visibility == 'private View' ? (<input class="form-check-input" type="radio" name="project_visibility" id="project_visibility3" checked />) : 
            (<input class="form-check-input" type="radio" name="project_visibility" id="project_visibility3" />)}
        <label class="form-check-label" for="project_visibility3">
            Private View
        </label>
        </div>
        <div style={{marginTop: '10px'}}>
        <button className="btn btn-primary" type="button" onClick={changeProject}>Change</button>
        </div>
        </div>
        <div className="center-div delete-zone" style={{marginTop: '20px'}}>
            <h5>Delete this Project?</h5>
        <button className="btn btn-danger" type="button" onClick={deletethisProject}>Delete</button>
        </div>
        </>
    ): 
    (<div className="center-div"> <h1>You are NOT Authorized to edit this Project!</h1></div>)}
    </>
  )
}

export default EditProject