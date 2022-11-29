import axios from 'axios'
const baseURL = 'http://localhost:3001/persons'


const getAll = () => {
    const request = axios.get(baseURL);
    return request.then((response)=>response.data);
}

const create = (newObj) => {
    const request = axios.post(baseURL,newObj);
    return request.then((response)=>response.data);
}

const update = (id,modObj) => {
    const request = axios.put(`${baseURL}/${id}`,modObj);
    return request.then((response)=>response.data);
}

const remove = (id) => {
    return axios.delete(`${baseURL}/${id}`);
}

export default {getAll,create,update,remove}