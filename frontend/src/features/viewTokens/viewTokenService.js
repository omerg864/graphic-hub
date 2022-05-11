import axios from 'axios';

const API_URL = '/api/viewTokens/';



const getViewTokens = async (query, token) => {
    var query_string = new URLSearchParams(query).toString();
    const response = await axios.get(API_URL + `?${query_string}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}

const getViewToken = async (id, token) => {
    const response = await axios.get(API_URL + id, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}


const createViewToken = async (data, token) => {
    const response = await axios.post(API_URL, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}


const updateViewToken = async (id, data, token) => {
    const response = await axios.put(API_URL + id, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
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
    VerifyViewToken,
    getViewToken
};

export default viewTokenService;

