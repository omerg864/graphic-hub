import Spinner from "../components/Spinner";
import { useEffect, useState, useCallback } from "react";
import { getProject, updateProject, reset, deleteProject } from "../features/projects/projectSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { BsTrash, BsExclamationLg } from "react-icons/bs";
import ImageViewer from "react-simple-image-viewer";


function EditProject() {

    const { project, isLoading, isSuccess, isError, message } = useSelector((state) => state.project);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const [isUser, setIsUser] = useState(false);

    const { user } = useSelector((state) => state.auth);

    const [projectName, setProjectName] = useState("");

    const [projectDescription, setProjectDescription] = useState("")

    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };


    const changeProject = async () => {
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
        <div className="center-div">
        <div className="content-section">
            <div className="center-div">
            <h1>Edit Section</h1>
            </div>
            <div>
        <p style={{fontWeight: '600'}}>Project Name</p>
        <input type="text" className="form-control" placeholder="Project Name" id="project-name" name="project-name" onChange={changeName} value={projectName} />
        </div>
        <div style={{marginTop: '10px'}}>
        <p style={{fontWeight: '600'}}>Project Description</p>
        <textarea name="project-description" className="form-control" id="project-description" placeholder="Description" value={projectDescription} onChange={changeDescription} style={{resize: 'both', width: '100%', height: '80px'}}></textarea>
        </div>
        <div>
            <p style={{fontWeight: '600'}}>Images</p>
            <div className="row-div">
                {project.images.map((image, index) => {
                    return (
                        <div className="image-container">
                        <img src={image} onClick={() => openImageViewer(index)} key={index} alt="project" style={{width: '100px', height: '100px'}} />
                        <div className="switch-image">
                        <label className="switch">
                        <input type="checkbox" className="switch-input" id={`deleteimage${index}`} name={`deleteimage${index}`}/>
                        <span className="switch-label" data-on="On" data-off="Off"><BsTrash className="trash-label"/></span>
                        <span className="switch-handle"></span>
                        </label>
                        </div>
                        </div>
                    )
                })}
                <input style={{marginTop: '40px'}} className="form-control" type="file" multiple id="project_images" name="project_images" />
            </div>
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
        <div>
        <p style={{fontWeight: '600'}}>Project Visibility</p>
        </div>
        <div className="form-check">
            {project.visibility == 'public' ? (<input className="form-check-input" type="radio" name="project_visibility" id="project_visibility1" checked />) :
             (<input className="form-check-input" type="radio" name="project_visibility" id="project_visibility1" />)}
        <label className="form-check-label" htmlFor="project_visibility1">
            Public
        </label>
        </div>
        <div className="form-check">
            {project.visibility == 'private' ? (<input className="form-check-input" type="radio" name="project_visibility" id="project_visibility2" checked/>) : 
            (<input className="form-check-input" type="radio" name="project_visibility" id="project_visibility2" />)}
        <label className="form-check-label" htmlFor="project_visibility2">
            Private
        </label>
        </div>
        <div className="form-check">
            {project.visibility == 'private View' ? (<input className="form-check-input" type="radio" name="project_visibility" id="project_visibility3" checked />) : 
            (<input className="form-check-input" type="radio" name="project_visibility" id="project_visibility3" />)}
        <label className="form-check-label" htmlFor="project_visibility3">
            Private View
        </label>
        </div>
        <div style={{marginTop: '10px'}}>
        <button className="btn btn-primary" type="button" onClick={changeProject}>Change</button>
        </div>
        </div>
        <div className="center-div delete-zone" style={{marginTop: '20px', width: 'fit-content'}}>
            <h4><BsExclamationLg style={{color: 'red'}}/></h4>
            <h5>Delete this Project?</h5>
        <button className="btn btn-danger" type="button" onClick={deletethisProject}>Delete</button>
        </div>
        </div>
        </>
    ): 
    (<div className="center-div"> <h1>You are NOT Authorized to edit this Project!</h1></div>)}
    </>
  )
}

export default EditProject