import axios from 'axios'

const url = 'http://localhost:3000/api/'

export default {
    setTermine(credentails){
        return axios
        .post(url + 'SetTermine/', credentails)
        .then(response => response.data)
    },
    setReservierungSchueler(credentails){
        return axios
        .post(url + 'SetReservierungSchueler/', credentails)
        .then(response => response.data)
    },
    buchHinzufuegen(credentails){
        return axios
        .post(url + 'buchHinzufuegen/', credentails)
        .then(response => response.data)
    },
    VerleihungEintragen(credentails){
        return axios
        .post(url + 'VerleihungEintragen/', credentails)
        .then(response => response.data)
    },
    BuchZurueckgegeben(credentails){
        return axios
        .post(url + 'BuchZurueckgegeben/', credentails)
        .then(response => response.data)
    },
    upload(credentails){
        return axios
        .post(url + 'Upload/', credentails)
        .then(response => response.data)
    },
}