import axios from 'axios';

const API_URL = '/api/workFlow/';

const getWorkFlows = async (query) => {
    var query_string = new URLSearchParams(query).toString();
    const response = await axios.get(API_URL + `?${query_string}`);
    return response;
}

const updateWorkFlow = async (data, token) => {
    const response = await axios.put(API_URL, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            accepts:"application/json"
        }
    });
    return response;
}

const workFlowService = {
    getWorkFlows,
    updateWorkFlow
}

export default workFlowService;
