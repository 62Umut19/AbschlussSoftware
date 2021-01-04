//express is for creating a web API.
const express = require('express');
const router = express.Router();

const db = require('../lib/db.js');

//jsonwebtoken is for handeling user sessions.
const jwt = require('jsonwebtoken');

const multer = require('multer')

const fileFilter = function (req, file, cb){
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if(!allowedTypes.includes(file.mimetype)){
        const error = new Error("Wrong file type");
        error.code = "LIMIT_FILE_TYPES";
        return cb(error, false)
    }

    cb(null, true)
}

const MAX_SIZE = 200000;

const upload = multer({
    dest: "./uploads/",
    fileFilter,
    limits:{
        fileSize: MAX_SIZE
    }
})


function TerminHinzufuegen(terminResult, datum, lehrer, raum) {
    return new Promise((resolve, reject) => {
        //Checks if the teacher has an appointment for the date and time.
        db.query(`SELECT * FROM zwtbl_slt WHERE datum = ${db.escape(datum)} AND lehrerid = ${db.escape(lehrer)} AND terminid = ${db.escape(terminResult)}`,
            (lehrerErr, lehrerResult) => {
                if (lehrerErr) {
                    return reject("Error in der Datenbank.")
                }

                if (!lehrerResult.length) {
                    //Checks whether the room is free at this time.
                    db.query(`SELECT * FROM zwtbl_slt WHERE datum = ${db.escape(datum)} AND raumid = ${db.escape(raum)} AND terminid = ${db.escape(terminResult)}`,
                        (ueberpruefungErr, ueberpruefungResult) => {
                            if (ueberpruefungErr) {
                                return reject("Error in der Datenbank.")
                            }

                            if (!ueberpruefungResult.length) {
                                //Create the appointment.
                                db.query(`INSERT INTO zwtbl_slt (schuelerid, lehrerid, terminid, raumid, datum) VALUES (NULL, ${db.escape(lehrer)}, ${db.escape(terminResult)}, ${db.escape(raum)}, ${db.escape(datum)})`)
                                return resolve()
                            }

                            return reject(`Der Raum den der Lehrer ${lehrer} bekommen sollte ist schon für einen anderen Lehrer reserviert.`)
                        }
                    )
                } else {
                    return reject(`Der Lehrer ${lehrer} hat zu diesem Zeitpunkt schon einen Termin.`)
                }
            }
        )
    })
}

//Create appointment for teachers.
router.post("/SetTermine", (req, res, next) => {
    db.query(`SELECT terminid FROM tbltermin WHERE CAST(terminstart as time) >= ${db.escape(req.body.uhrzeitStart)} AND CAST(terminende as time) <= ${db.escape(req.body.uhrzeitEnde)}`,
        async (terminErr, terminResult) => {
            if (terminErr) {
                return res.status(400).send({
                    msg: terminErr
                })
            }

            if (!terminResult.length) {
                return res.status(400).send({
                    msg: "Vorgang abgebrochen. In der Datenbank sind keine Uhrzeiten gespeichert."
                })
            } else {
                for (let k = 0; k < req.body.datum.length; k++) {
                    for (let i = 0; i < terminResult.length; i++) {
                        for (let j = 0; j < req.body.lehrerRaumm.length; j++) {
                            try {
                                await TerminHinzufuegen(terminResult[i].terminid, req.body.datum[k], req.body.lehrerRaumm[j].lehrer, req.body.lehrerRaumm[j].raumid)
                            } catch (err) {
                                console.log(err)
                                return res.status(400).send({
                                    msg: err
                                })
                            }
                        }
                    }
                }
            }

            return res.status(200).send({
                msg: "Die Termine wurden erfolgreich in die Datenbank eingetragen."
            })
        }
    )
})

router.post("/SetReservierungSchueler", (req, res, next) => {
    db.query(`SELECT * FROM zwtbl_slt WHERE sltid = ${db.escape(req.body.sltid)}`,
        (zwtblErr, zwtblResult) => {
            if (zwtblErr) {
                return res.status(400).send({
                    msg: zwtblErr
                })
            }

            if (!zwtblResult.length) {
                return res.status(400).send({
                    msg: "Der Termin ist abgelaufen."
                })
            }
            //Checks if the student has on this time a appointment.
            db.query(`SELECT * FROM zwtbl_slt WHERE schuelerid = ${db.escape(req.body.schuelerid)} AND datum = ${db.escape(zwtblResult[0].datum)} AND terminid = ${db.escape(zwtblResult[0].terminid)}`,
                (ueberpruefungZeitpunktErr, ueberpruefungZeitpunktResult) => {
                    if (ueberpruefungZeitpunktErr) {
                        return res.status(400).send({
                            msg: ueberpruefungZeitpunktErr
                        })
                    }

                    //Checks whether the student has an appointment with this teacher that day.
                    if (!ueberpruefungZeitpunktResult.length) {
                        db.query(`SELECT * FROM zwtbl_slt WHERE schuelerid = ${db.escape(req.body.schuelerid)} AND lehrerkuerzel = ${db.escape(zwtblResult[0].lehrerkuerzel)} AND datum = ${db.escape(zwtblResult[0].datum)}`,
                            (ueberpruefungLehrerErr, ueberpruefungLehrerResult) => {
                                if (ueberpruefungLehrerErr) {
                                    return res.status(400).send({
                                        msg: ueberpruefungLehrerErr
                                    })
                                }
                                if (!ueberpruefungLehrerResult.length) {
                                    db.query(`UPDATE zwtbl_slt SET schuelerid = ${db.escape(req.body.schuelerid)} WHERE sltid = ${db.escape(req.body.sltid)}`)
                                    
                                    return res.status(200).send({
                                        msg: "Die Reservierung wurde erfolgreich eingetragen."
                                    })
                                } else {
                                    return res.status(400).send({
                                        msg: `Sie haben schon an diesem Tag einen Termin bei diesem Lehrer.`
                                    })
                                }
                            }
                        )
                    } else {
                        return res.status(400).send({
                            msg: `Sie haben zu diesem Zeitpunkt schon einen Termin bei dem Lehrer ${ueberpruefungZeitpunktResult[0].lehrerkuerzel}.`
                        })
                    }
                }

            )
        }
    )
})

router.post("/buchHinzufuegen", (req, res, next) => {
    //Checks if the book number (PK) is already in the database.
    if(req.body.buchnr == ""){
        return res.status(400).send({
            msg: "Tragen Sie bitte was in die Buchnr ein."
        })
    }
    
    //Checks if the book number already exist in the database.
    db.query(`SELECT * FROM tblbuch WHERE buchnr = ${db.escape(req.body.buchnr)}`,
        (err, result) => {
            if(err){
                return res.status(400).send({
                    msg: err
                })
            }

            if(!result.length){
                //Checks if the book properties already exist.
                db.query(`SELECT * FROM tblbuch WHERE isbn = ${db.escape(req.body.isbn)} AND title = ${db.escape(req.body.title)} AND autor = ${db.escape(req.body.autor)} AND jahr = ${db.escape(req.body.jahr)} AND verlag = ${db.escape(req.body.verlag)}`,
                    (checkErr, checkResult) => {
                        if(checkErr){
                            return res.status(400).send({
                                msg: checkErr
                            })
                        }

                        if(!checkResult.length){
                            //If the book properties doesn't exist in the database.
                            db.query(`SELECT * FROM tblbuch WHERE isbn = ${db.escape(req.body.isbn)}`,
                                (isbnErr, isbnResult) => {
                                    if(isbnErr){
                                        return res.status(400).send({
                                            msg: isbnErr
                                        })
                                    }

                                    if(!isbnResult.length){
                                        db.query(`INSERT INTO tblbuch VALUES (${db.escape(req.body.buchnr)}, ${db.escape(req.body.isbn)}, ${db.escape(req.body.title)}, ${db.escape(req.body.autor)}, ${db.escape(req.body.jahr)}, ${db.escape(req.body.verlag)})`)

                                        return res.status(200).send({
                                            msg: "Das Buch wurde erfolgreich in die Datenbank eingetragen."
                                        })
                                    }else{
                                        return res.status(400).send({
                                            msg: `Die ISBN ist schon in der Datenbank vorhanden mit anderen Buch Attributen.`
                                        })
                                    }
                                }
                            )
                        } else {
                            db.query(`INSERT INTO tblbuch VALUES (${db.escape(req.body.buchnr)}, ${db.escape(req.body.isbn)}, ${db.escape(req.body.title)}, ${db.escape(req.body.autor)}, ${db.escape(req.body.jahr)}, ${db.escape(req.body.verlag)})`)

                            return res.status(200).send({
                                msg: "Das Buch wurde erfolgreich in die Datenbank eingetragen."
                            })
                        }
                    }                
                )
            }else{
                return res.status(400).send({
                    msg: `Die Buchnr ${req.body.buchnr} ist schon in der Datenbank vorhanden.`
                })
            }
        }
    )
})

router.post("/VerleihungEintragen", (req, res, next) => {
    try{
        db.query(`INSERT INTO zwtbl_ausleihbuch(buchnr, schuelerid, datum, zurueckgegeben) VALUES (${db.escape(req.body.buchnr)}, ${db.escape(req.body.schuelerid)}, now(), 0)`)
        
        return res.status(200).send({
            msg: "Die Verleihung wurde erfolgreich in die Datenbank eingetragen."
        })
    }catch(err){
        return res.status(400).send({
            msg: "Es ist etwas schief gelaufen"
        })
    }
    
})

router.post("/BuchZurueckgegeben", (req, res, next) => {
    try{
        db.query(`UPDATE zwtbl_ausleihbuch SET zurueckgegeben = 1 , zurueckgegebenAm = now() WHERE ausleihbuchid = ${db.escape(req.body.ausleihbuchid)}`)
        
        return res.status(200).send({
            msg: "Die Zurückgabe wurde in der Datenbank eingetragen."
        })
    }catch(err){
        return res.status(400).send({
            msg: "Es ist etwas schief gelaufen."
        })
    }
})

router.post('/Upload', upload.single("file"), (req, res) => {
    return res.status(200).send({
        msg: "Erfolgreich"
    })
})


module.exports = router