import axios from 'axios'

const url = 'http://localhost:3000/api/'

export default {
    setTermine(credentails){
        return axios
        .post(url + 'SetTermine/', credentails)
        .then(response => response.data)
    },
}