//express is for creating a web API.
const express = require('express');
const router = express.Router();

//bcryptjs is for encrypting/decrypting passwords.
const bcrypt = require('bcryptjs');

//uuid is for creating IDs for users.
const uuid = require('uuid');

const db = require('../lib/db.js');

const fs = require('fs');
const csv = require('csv-parser');

var results = []

function ReadCSVFile(path) {

    fs.createReadStream(path)
        .pipe(csv({}))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            //console.log(results)
            return results
        })
}
var i = 0;

function CreateSchueler() {
    db.query(`SELECT * FROM tblschueler WHERE LOWER(benutzername) = LOWER(${db.escape(results[i].benutzername)})`,
        (err, result) => {
            if (!result.length) {
                bcrypt.hash(results[i]['passwort'], 10, (err, hash) => {
                    if (err) {
                        return res.status(400).send({
                            msg: err
                        })
                    } else {
                        try {
                            db.query(`SELECT klassenid FROM tblklasse WHERE klasse = ${db.escape(results[i]['klasse'])}`,
                                (klasseErr, klasseResult) => {
                                    db.query(`SELECT anredeid FROM tblanrede WHERE anrede = ${db.escape(results[i]['anrede'])}`,
                                        (anredeErr, anredeResult) => {
                                            db.query(`INSERT INTO tblschueler VALUES(${db.escape(uuid.v4())}, ${db.escape(anredeResult[0].anredeid)}, ${db.escape(results[i].benutzername)}, ${db.escape(hash)}, ${db.escape(results[i].vorname)}, ${db.escape(results[i].nachname)}, ${db.escape(results[i].geburtsdatum)}, ${db.escape(results[i].letzter_login)}, ${db.escape(results[i].email)}, ${db.escape(klasseResult[0].klassenid)});`)
                                            if (i < results.length - 1) {
                                                i++
                                                CreateSchueler()
                                            }
                                        }
                                    )
                                }
                            )
                        } catch (err) {
                            console.log(err)
                        }
                    }
                })
            }
        }
    )
}

router.post("/SchuelerErstellen", (req, res, next) => {

    ReadCSVFile('U:\\AbschlussSoftwareDaten\\Schueler.csv')
    i = 0
    setTimeout(CreateSchueler, 100)

})

function CreateLehrer(){
    db.query(`SELECT * FROM tbllehrer WHERE LOWER(lehrerkuerzel) = LOWER(${db.escape(results[i].lehrerkuerzel)})`,
        (err, result) => {
            if(!result.length){
                bcrypt.hash(results[i]['passwort'], 10, (err, hash) => {
                    if(err){
                        return res.status(400).send({
                            msg: err
                        }) 
                    } else {
                        try{
                            db.query(`SELECT anredeid FROM tblanrede WHERE anrede = ${db.escape(results[i].anrede)}`,
                                (anredeErr, anredeResult) => {
                                    db.query(`INSERT INTO tbllehrer VALUES (${db.escape(results[i].lehrerkuerzel)}, ${db.escape(anredeResult[0].anredeid)}, ${db.escape(results[i].vorname)}, ${db.escape(results[i].nachname)}, ${db.escape(hash)}, ${db.escape(results[i].ist_admin)}, ${db.escape(results[i].email)});`)
                                    if(i < results.length-1){
                                        i++
                                        CreateLehrer()
                                    }
                                }
                            )
                        }catch(err){
                            console.log(err)
                        }
                    }
                })
            }
        }
    )
}

router.post("/LehrerErstellen", (req, res, next) => {
    ReadCSVFile('U:\\AbschlussSoftwareDaten\\Lehrer.csv')
    i=0
    setTimeout(CreateLehrer, 100)
})

var minute = 0;
var stunde = 0;

function TermineErstellen() {

    if (stunde >= 23 && minute >= 45) {

    } else {
        if (minute != 45) {
            db.query(`INSERT INTO tbltermin (terminstart, terminende) VALUES('2020-10-01 ${db.escape(stunde)}:${db.escape(minute)}:00', '2020-10-01 ${db.escape(stunde)}:${db.escape(minute + 15)}:00');`)
        } else {
            db.query(`INSERT INTO tbltermin (terminstart, terminende) VALUES('2020-10-01 ${db.escape(stunde)}:${db.escape(minute)}:00', '2020-10-01 ${db.escape(stunde+1)}:00:00');`)
        }

        minute += 15;

        if (minute == 60) {
            minute = 0
            stunde++;
        }
        if (stunde != 23 && minute != 45) {
            TermineErstellen()
        }
    }
}


router.post("/TermineErstellen", (req, res, next) => {
    minute = 0
    stunde = 0
    TermineErstellen();
})

module.exports = router;