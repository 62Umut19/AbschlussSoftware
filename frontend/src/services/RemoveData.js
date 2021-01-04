import axios from 'axios'

const url = 'http://localhost:3000/api/'

export default {
    removeTS(credentails){
        return axios
        .post(url + 'RemoveTS/', credentails)
        .then(response => response.data)
    },
}