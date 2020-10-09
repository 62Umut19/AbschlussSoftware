const mysql = require('mysql')
var fs = require('fs')

var passwort = fs.readFileSync("U:\\DbPw.txt").toString();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: passwort,
    database: 'schulsoftwaredb'
})

connection.connect()
module.exports = connection