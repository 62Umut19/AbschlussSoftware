//express is for creating a web API.
const express = require('express');
const router = express.Router();

//bcryptjs is for encrypting/decrypting passwords.
const bcrypt = require('bcryptjs');
//uuid is for creating IDs for users.
const uuid = require('uuid');
//jsonwebtoken is for handeling user sessions.
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');

const fs = require('fs');

//Read the secretkeys from a txt file
var SECRETKEYs = fs.readFileSync('U:\\AbschlussSoftwareDaten\\TokenAbschlussSoftware.txt').toString();
SECRETKEYs = SECRETKEYs.split(';'); 


//Login for students.
router.post("/LoginSchueler", (req, res, next) => {
    db.query(`SELECT * FROM tblschueler WHERE LOWER(benutzername) = LOWER(${db.escape(req.body.benutzername)});`,
        //Callback function ()=>.
        (err, result) => {
            if (err) {
                return res.status(400).send({
                    msg: err
                })
            }
            if (!result.length) {
                //If no one with this username is in the database.
                console.log(`Kein User mit dem Namen ${req.body.benutzername} ist in der Datenbank`)
                res.status(401).send({
                    msg: "Benutzername oder Passwort ist Inkorrekt"
                })
            } else {
                //This methode compares the password from the user input and the hashed password from the database.
                bcrypt.compare(
                    req.body.passwort,
                    result[0]['passwort'],
                    //If the passwords match, then gives the callback function a true value back.
                    //If the passwords doesn't match, then gives the callback function a false value back.
                    (bErr, bResult) => {
                        if (bErr) {
                            //Password is wrong.
                            return res.status(401).send({
                                msg: "Benutzername oder Passwort ist Inkorrekt"
                            })
                        }

                        if (bResult) {
                            //Create the token for the verification.
                            const token = jwt.sign({
                                benutzername: result[0].benutzername,
                                schuelerId: result[0].schuelerid
                            },
                                //SECRETKEY
                                SECRETKEYs[0],
                                {
                                    //expiration time, 7d = 7 days
                                    expiresIn: '7d'
                                }
                            )

                            db.query(`UPDATE tblschueler SET letzter_login = now() WHERE schuelerid = '${result[0].schuelerid}';`)

                            console.log(`Schüler ${result[0].benutzername} eingeloggt`)

                            return res.status(200).send({
                                //Return values.
                                msg: 'Eingeloggt',
                                token,
                                schueler: result[0]
                            })
                        }

                        console.log("nicht Eingeloggt")
                        return res.status(401).send({
                            msg: "Benutzername oder Passwort ist Inkorrekt"
                        })
                    }
                )
            }
        }
    )
})

//Login for teacher
router.post("/LoginLehrer", (req, res, next) => {
    db.query(`SELECT * FROM tbllehrer WHERE LOWER(lehrerkuerzel) = LOWER(${db.escape(req.body.benutzername)});`,
        (err, result) => {
            if (err) {
                return res.status(400).send({
                    msg: err
                })
            }

            if (!result.length) {
                //If the query is empty
                console.log(`Keinen Lehrer mit dem Kuerzel ${req.body.benutzername}`)
                return res.status(401).send({
                    msg: "Benutzername oder Passwort ist Inkorrekt"
                })
            } else {
                //This methode compares the password from the user input and the hashed password from the database.
                bcrypt.compare(
                    req.body.passwort,
                    result[0]['passwort'],
                    //If the passwords match, then gives the callback function a true value back.
                    //If the passwords doesn't match, then gives the callback function a false value back.
                    (bErr, bResult) => {
                        if (bErr) {
                            return res.status(401).send({
                                msg: "Benutzername oder Passwort ist Inkorrekt"
                            })
                        }

                        if (bResult) {
                            if (result[0].ist_admin == 1) {
                                //Create token for verification of teachers with admin rights.
                                const token = jwt.sign({
                                    benutzername: req.body.benutzername,
                                    lehrerkuerzel: result[0].lehrerkuerzel
                                },
                                    //SECRETKEY
                                    SECRETKEYs[1],
                                    {
                                        //expiration time, 1d = 1 day
                                        expiresIn: "1d"
                                    }
                                )

                                console.log(`Lehrer ${req.body.benutzername} eingeloggt mit Admin rechten.`)

                                return res.status(200).send({
                                    //Return values.
                                    msg: 'Eingeloggt',
                                    token,
                                    lehrer: result[0]
                                })
                            }
                            if (result[0].ist_admin == 2) {
                                //Create token for verification of teachers with only book department rights.
                                const token = jwt.sign({
                                    benutzername: req.body.benutzername,
                                    lehrerkuerzel: result[0].lehrerkuerzel
                                },
                                    //SECRETKEY
                                    SECRETKEYs[2],
                                    {
                                        //expiration time, 1d = 1 day
                                        expiresIn: "1d"
                                    }
                                )
                                console.log(`Lehrer ${req.body.benutzername} eingeloggt mit Buch Admin rechten.`)

                                return res.status(200).send({
                                    //Return values.
                                    msg: 'Eingeloggt',
                                    token,
                                    lehrer: result[0]
                                })
                            }

                            //Create token for verification of teachers with no admin rights.
                            const token = jwt.sign({
                                benutzername: req.body.benutzername,
                                lehrerkuerzel: result[0].lehrerkuerzel
                            },
                                //SECRETKEY
                                SECRETKEYs[3],
                                {
                                    //expiration time, 1d = 1 day
                                    expiresIn: "1d"
                                }
                            )
                            console.log(`Lehrer ${req.body.benutzername} eingeloggt mit keinen Admin rechten.`)

                            return res.status(200).send({
                                //Return values.
                                msg: 'Eingeloggt',
                                token,
                                lehrer: result[0]
                            })
                        } else {
                            //Password doesn't match
                            console.log("nicht Eingeloggt")

                            return res.status(401).send({
                                msg: "Benutzername oder Passwort ist Inkorrekt"
                            })
                        }
                    })
            }

        }
    )
})

module.exports = router;