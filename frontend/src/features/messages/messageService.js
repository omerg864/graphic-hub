import axios from 'axios';

const API_URL = '/api/messages/';



const getMessages = async (username, token) => {
    const response = await axios.get(API_URL + username, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}

const getChats = async (token) => {
    const response = await axios.get(API_URL + "get/chats/", {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}

const deleteChats = async (username, token) => {
    const response = await axios.delete(API_URL + "chats/" + username, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}

const sendMessage = async (username, message, token) => {
    const response = await axios.post(API_URL, {username, message}, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}

const deleteMessage = async (id, token) => {
    const response = await axios.delete(API_URL + id, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}






const messageService = {
    getMessages,
    sendMessage,
    deleteMessage,
    getChats,
    deleteChats
};

export default messageService;
