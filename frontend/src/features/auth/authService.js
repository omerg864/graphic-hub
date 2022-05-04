import axios from 'axios';
import {toast} from 'react-toastify';

const API_URL = '/api/users/';

const register = async (user) => {
    try {
        const response = await axios.post(API_URL + "register", user);
        console.log(response.data);
        if (response.status === 201) {
            toast.success("User created please check your email to verify your account");
        }
        else {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

const login = async (user) => {
    try {
        const response = await axios.post(API_URL + "login/", user);
        if (response.status === 200) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        } else {
            response.status(400);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
};

const logout = async () => {
    localStorage.removeItem('user');
}

const verifyAccount = async (token) => {
    try {
        const response = await axios.get(API_URL + "verify/" + token);
            if (response.status === 200) {
        return response.data;
        } else {
            response.status(400);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

const getUser = async (username, token) => {
    try {
        
        const response = await axios.get(API_URL + username);
        if (response.status === 200) {
            return response.data;
        } else {
            response.status(400);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

const updateFollow = async (username, token) => {
    try {
        console.log(username)
        const response = await axios.get(API_URL + "follow/" + username, {
            headers: {
                Authorization: `Bearer ${token}`,
                accepts: 'application/json'
            }
        });
        if (response.status === 200) {
            return response.data;
        } else {
            response.status(400);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

const searchUser = async (username) => {
    try {
        const response = await axios.get(API_URL + "search/" + username);
        if (response.status === 200) {
            return response.data;
        } else {
            response.status(400);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

const getUserByid = async (id, token) => {
    try {
        const response = await axios.get(API_URL + "/id/" + id);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}


const authService = {
    register,
    logout,
    login,
    verifyAccount,
    getUser,
    updateFollow,
    searchUser,
    getUserByid
};

export default authService;