import axios from 'axios';

const API_URL = '/api/projects/';



const getProjects = async (query) => {
    var query_string = new URLSearchParams(query).toString();
    const response = await axios.get(API_URL + `?${query_string}`);
    return response;
}

const createProject = async (data, token) => {
    var images_urls = [];
    const uploaders = Object.values(data.images).map(file => {
    // Initial FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_PRESENT_NAME); // Replace the preset name with your own
    formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY); // Replace API key with your own Cloudinary key
    formData.append("timestamp", (Date.now() / 1000) | 0);
    
    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
    return axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
    }).then(response => {
        const data = response.data;
        const fileURL = data.secure_url // You should store this URL for future references in your app
        images_urls.push(fileURL);
    })
    });

    // Once all the files are uploaded 
    await axios.all(uploaders);
    data.images = images_urls;
    var response = await axios.post(API_URL, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}

const updateProject = async (id, data, type, token) => {
    if (type === 'change') {
        var images_urls = [];
        const uploaders = Object.values(data.new_images).map(file => {
            // Initial FormData
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.REACT_APP_PRESENT_NAME); // Replace the preset name with your own
            formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY); // Replace API key with your own Cloudinary key
            formData.append("timestamp", (Date.now() / 1000) | 0);
            
            // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
            return axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, formData, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            }).then(response => {
                const data = response.data;
                const fileURL = data.secure_url // You should store this URL for future references in your app
                images_urls.push(fileURL);
            })
            });
        
            // Once all the files are uploaded 
            await axios.all(uploaders);
            data.images = data.images.concat(images_urls);
            const response = await axios.put(API_URL + id + `?${type}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accepts:"application/json"
                }
            });
            return response;
    } else {
        const response = await axios.put(API_URL + id + `?${type}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                accepts:"application/json"
            }
        });
        return response;
    }
}

const deleteProject = async (id, token) => {
    const response = await axios.delete(API_URL + id, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}

const getProject = async (name, username, token) => {
    const response = await axios.get(API_URL + "project/" + username + "/" + name, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}

const getPrivateProjects = async (token) => {
    const response = await axios.get(API_URL + 'private', {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}

const searchProjects = async (query) => {
    const response = await axios.get(API_URL + 'search/' + query)
    return response.data;
}






const projectService = {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getPrivateProjects,
    searchProjects
};

export default projectService;
