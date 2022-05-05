import axios from 'axios';

const API_URL = '/api/projects/';



const getProjects = async (query) => {
    var query_string = new URLSearchParams(query).toString();
    const response = await axios.get(API_URL + `?${query_string}`);
    return response;
}

const createProject = async (data, token) => {
    try {
        const response = await axios.post(API_URL, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                accepts:"application/json"
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

const updateProject = async (id, data, type, token) => {
    try {
        const response = await axios.put(API_URL + id + `?${type}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                accepts:"application/json"
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

const deleteProject = async (id, token) => {
    try {
        const response = await axios.delete(API_URL + id, {
            headers: {
                Authorization: `Bearer ${token}`,
                accepts:"application/json"
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

const getProject = async (name, username, token) => {
    try {
        const response = await axios.get(API_URL + "project/" + username + "/" + name, {
            headers: {
                Authorization: `Bearer ${token}`,
                accepts:"application/json"
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

const getPrivateProjects = async (token) => {
    try {
        const response = await axios.get(API_URL + 'private', {
            headers: {
                Authorization: `Bearer ${token}`,
                accepts:"application/json"
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

const searchProjects = async (query) => {
    try {
        const response = await axios.get(API_URL + 'search/' + query)
        return response.data;
    } catch (error) {
        console.log(error);
    }
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
