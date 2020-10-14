import axios from 'axios'

const url = 'http://localhost:3000/api/'

export default {
    loginSchueler(credentails){
        return axios
        .post(url + 'LoginSchueler/', credentails)
        .then(response => response.data)
    },
    loginLehrer(credentails){
        return axios
        .post(url + 'LoginLehrer/', credentails)
        .then(response => response.data)
    }
}