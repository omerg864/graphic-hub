import axios from 'axios';

const API_URL = '/api/viewTokens/';



const getViewTokens = async (token) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                accepts:"application/json"
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


const createViewToken = async (data, token) => {
    try {
        const response = await axios.post(API_URL, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                accepts:"application/json"
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


const updateViewToken = async (data, token) => {
    try {
        const response = await axios.post(API_URL, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                accepts:"application/json"
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


const deleteViewToken = async (id, token) => {
    try {
        const response = await axios.delete(API_URL + id, {
            headers: {
                Authorization: `Bearer ${token}`,
                accepts:"application/json"
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

const VerifyViewToken = async (token_num, token) => {
    try {
        const response = await axios.get(API_URL + token_num, {
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





const viewTokenService = {
    getViewTokens,
    createViewToken,
    updateViewToken,
    deleteViewToken,
    VerifyViewToken
};

export default viewTokenService;

