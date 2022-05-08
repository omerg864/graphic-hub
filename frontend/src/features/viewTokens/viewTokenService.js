import axios from 'axios';

const API_URL = '/api/viewTokens/';



const getViewTokens = async (token) => {
    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response.data;
}


const createViewToken = async (data, token) => {
    const response = await axios.post(API_URL, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response.data;
}


const updateViewToken = async (data, token) => {
    const response = await axios.post(API_URL, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response.data;
}


const deleteViewToken = async (id, token) => {
    const response = await axios.delete(API_URL + id, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}

const VerifyViewToken = async (token_num, token) => {
    const response = await axios.get(API_URL + token_num, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}





const viewTokenService = {
    getViewTokens,
    createViewToken,
    updateViewToken,
    deleteViewToken,
    VerifyViewToken
};

export default viewTokenService;

