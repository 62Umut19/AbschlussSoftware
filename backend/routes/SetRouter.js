//express is for creating a web API.
const express = require('express');
const router = express.Router();

const db = require('../lib/db.js');

//jsonwebtoken is for handeling user sessions.
const jwt = require('jsonwebtoken');

function TerminHinzufuegen(terminResult, datum, lehrer, raum){
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM zwtbl_slt WHERE datum = ${db.escape(datum)} AND lehrerid = ${db.escape(lehrer)} AND terminid = ${db.escape(terminResult)}`,
            (lehrerErr, lehrerResult) => {
                if(lehrerErr){
                    return reject("Error in der Datenbank.")
                }

                if(!lehrerResult.length){
                    db.query(`SELECT * FROM zwtbl_slt WHERE datum = ${db.escape(datum)} AND raumid = ${db.escape(raum)} AND terminid = ${db.escape(terminResult)}`,
                       (ueberpruefungErr, ueberpruefungResult) => {
                        if(ueberpruefungErr){
                            return reject("Error in der Datenbank.")
                           }

                           if(!ueberpruefungResult.length){
                            db.query(`INSERT INTO zwtbl_slt (schuelerid, lehrerid, terminid, raumid, datum) VALUES (NULL, ${db.escape(lehrer)}, ${db.escape(terminResult)}, ${db.escape(raum)}, ${db.escape(datum)})`)
                            return resolve()
                           }
                           
                           return reject(`Der Raum den der Lehrer ${lehrer} bekommen sollte ist schon für einen anderen Lehrer reserviert.`)
                       } 
                    )
                }else{
                    return reject(`Der Lehrer ${lehrer} hat zu diesem Zeitpunkt schon einen Termin.`)    
                }
            }
        )
    })
}

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
                            try{
                                await TerminHinzufuegen(terminResult[i].terminid, req.body.datum[k], req.body.lehrerRaumm[j].lehrer,req.body.lehrerRaumm[j].raumid)
                            }catch (err){
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


module.exports = router