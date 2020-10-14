import axios from 'axios'

const url = 'http://localhost:3000/api/'

export default {
    getLehrer(){
        return axios
        .get(url + 'GetLehrer/')
        .then(response => response.data)
    },
    getRaueme(){
        return axios
        .get(url + 'GetRaueme/')
        .then(response => response.data)
    },
}