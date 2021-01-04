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
    getTermine(credentails){
        return axios
        .post(url + 'GetTermine/', credentails)
        .then(response => response.data)
    },
    getMeineTermineSchueler(credentails){
        return axios
        .post(url + 'GetMTSchueler/', credentails)
        .then(response => response.data)
    },
    getMeineTermineLehrer(credentails){
        return axios
        .post(url + 'GetMTLehrer/', credentails)
        .then(response => response.data)
    },
    getBuecher(){
        return axios
        .get(url + 'GetBuecher/')
        .then(response => response.data)
    },
    getK(){
        return axios
        .get(url + 'GetK/')
        .then(response => response.data)
    },
    getSchuelerKlasse(credentails){
        return axios
        .post(url + 'GetSchuelerKlasse/', credentails)
        .then(response => response.data)
    },
    getBuchNummer(credentails){
        return axios
        .post(url + 'GetBuchNummer/', credentails)
        .then(response => response.data)
    },
    getVergebeneBuecher(credentails){
        return axios
        .post(url + 'GetVergebeneBuecher/', credentails)
        .then(response => response.data)
    },
    getVerliehenesBuch(){
        return axios
        .get(url + 'GetVerliehenesBuch/')
        .then(response => response.data)
    },
}