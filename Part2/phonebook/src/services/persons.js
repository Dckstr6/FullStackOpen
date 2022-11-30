import axios from 'axios'
const baseURL = 'http://localhost:3002/api/persons'


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

let exp = {getAll,create,update,remove};

export default exp;