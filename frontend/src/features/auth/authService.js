import axios from 'axios';
import {toast} from 'react-toastify';

const API_URL = '/api/users/';

const register = async (user) => {
    const response = await axios.post(API_URL + "register", user);
    if (response.status === 201) {
        toast.success("User created please check your email to verify your account");
    }
    return response;
};

const login = async (user) => {
    const response = await axios.post(API_URL + "login/", user);
    if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
};

const logout = async () => {
    localStorage.removeItem('user');
}

const verifyAccount = async (token) => {
    const response = await axios.get(API_URL + "verify/" + token);
    return response;
}

const getUser = async (username) => {
    const response = await axios.get(API_URL + username);
    return response;
}

const updateFollow = async (username, token) => {
    const response = await axios.get(API_URL + "follow/" + username, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts: 'application/json'
        }
    });
    return response;
}

const searchUser = async (username) => {
    const response = await axios.get(API_URL + "search/" + username);
    return response;
}

const getUserByid = async (id, token) => {
    const response = await axios.get(API_URL + "id/" + id);
    return response;
}

const updateUser = async (data, token) => {
    if (data.image) {
        // Initial FormData
        const formData = new FormData();
        formData.append("file", data.img_url);
        formData.append("upload_preset", process.env.REACT_APP_PRESENT_NAME); // Replace the preset name with your own
        formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY); // Replace API key with your own Cloudinary key
        formData.append("timestamp", (Date.now() / 1000) | 0);
        
        // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
        await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, formData, {
            headers: { "X-Requested-With": "XMLHttpRequest" },
        }).then(response => {
            const data2 = response.data;
            const fileURL = data2.secure_url // You should store this URL for future references in your app
            data.img_url = fileURL;
        })
    const response = await axios.put(API_URL, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts: 'application/json'
        }
    });
    return response;
} else {
    const response = await axios.put(API_URL, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts: 'application/json'
        }
    });
    return response;
    }
}

const updatePassword = async (data, token) => {
    const response = await axios.put(API_URL + "password", data, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts: 'application/json'
        }
    });
    return response;
}


const resetPassword = async (data, token) => {
    const response = await axios.put(API_URL + "resetPassword/" + token, data);
    return response;
}


const createResetPassword = async (data) => {
    const response = await axios.post(API_URL + "sendResetPassword/", data);
    return response;
}


const authService = {
    register,
    logout,
    login,
    verifyAccount,
    getUser,
    updateFollow,
    searchUser,
    getUserByid,
    updateUser,
    updatePassword,
    createResetPassword,
    resetPassword
};

export default authService;