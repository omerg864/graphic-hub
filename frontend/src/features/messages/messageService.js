import axios from 'axios';

const API_URL = '/api/messages/';



const getMessages = async (username, token) => {
    try {
        const response = await axios.get(API_URL + username, {
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

const sendMessage = async (username, message, token) => {
    try {
        const response = await axios.post(API_URL, {username, message}, {
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

const deleteMessage = async (id, token) => {
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






const messageService = {
    getMessages,
    sendMessage,
    deleteMessage
};

export default messageService;
