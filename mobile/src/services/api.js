import axios from 'axios';

const api = axios.create({
    baseURL: 'http://tindev-backstage.herokuapp.com/developers'
});

export default api;