//express is for creating a web API.
const express = require('express');
const router = express.Router();

const db = require('../lib/db.js');

//jsonwebtoken is for handeling user sessions.
const jwt = require('jsonwebtoken');

//const middleware = require('../middleware/users.js')

async function GetAnrede(anredeid) {

    return new Promise((resolve, reject) => {
        db.query(`SELECT anrede FROM tblanrede WHERE anredeid = ${db.escape(anredeid)}`,
            (err, result) => {
                resolve(result[0].anrede)
            }
        )
    })
}

router.get("/GetLehrer", async function (req, res, next) {
    db.query(`SELECT lehrerkuerzel, anredeid, vorname, nachname FROM tbllehrer`,
        async (err, result) => {
            if (err) {
                return res.status(400).send({
                    msg: err
                })
            }

            if (!result.length) {
                return res.status(400).send({
                    msg: "In der Datenbank sind keine Lehrer vorhanden."
                })
            } else {
                for (let i = 0; i < result.length; i++) {
                    let anrede = await GetAnrede(result[i].anredeid)
                    result[i].anredeid = anrede
                }
            }
            return res.status(200).send({
                result
            })
        }
    )
})

router.get("/GetRaueme", (req, res, next) => {
    db.query(`SELECT * FROM tblraum`,
        (err, result) => {
            if (err) {
                return res.status(400).send({
                    msg: err
                })
            }
            if (!result.length) {
                return res.status(400).send({
                    msg: "In der Datenbank sind keine Lehrer vorhanden."
                })
            } else {
                return res.status(200).send({
                    result
                })
            }
        }
    )
})


function getDatum(date) {
    return new Promise((resolve, reject) => {
        try {
            var ms = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezermber'];
            resolve(date.getDate() + '-' + ms[date.getMonth()] + '-' + date.getFullYear())
        } catch (err) {
            reject("Bei der Umwandlung vom Datum ist etwas schief gelaufen.")
        }
    })
}

//Get time from datetime
function getUhrzeit(start, ende) {
    return new Promise((resolve, reject) => {
        try {
            var startmin = start.getMinutes()
            startmin = (startmin < 10 ? "0" : "") + startmin

            var endemin = ende.getMinutes()
            endemin = (endemin < 10 ? "0" : "") + endemin

            return resolve(start.getHours() + ":" + startmin + "-" + ende.getHours() + ":" + endemin)
        } catch (err) {
            return reject("Bei der Umwandlung von Datetime zu Time ist etwas schief gelaufen.")
        }
    })
}

function GetTerminUhrzeitstart(terminid) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT terminstart FROM tbltermin WHERE terminid = ${db.escape(terminid)}`,
            (err, result) => {
                if (err) {
                    return reject("Error in der Datenbank.")
                }

                if (!result.length) {
                    return reject("Die Terminid ist nicht vorhanden.")
                } else {
                    return resolve(result[0].terminstart)
                }
            }
        )
    })
}

function GetTerminUhrzeitende(terminid) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT terminende FROM tbltermin WHERE terminid = ${db.escape(terminid)}`,
            (err, result) => {
                if (err) {
                    return reject("Error in der Datenbank.")
                }

                if (!result.length) {
                    return reject("Die Terminid ist nicht vorhanden.")
                } else {
                    return resolve(result[0].terminende)
                }
            }
        )
    })
}

function GetRaum(raumid) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT raum FROM tblraum WHERE raumid = ${db.escape(raumid)}`,
            (err, result) => {
                if (err) {
                    return reject("Error in der Datenbank")
                }

                if (!result.length) {
                    return reject("Die Raumid ist nicht in der Datenbank vorhanden.")
                } else {
                    return resolve(result[0].raum)
                }
            }
        )
    })
}

router.post("/GetTermine", (req, res, next) => {
    var result = []
    db.query(`SELECT * FROM zwtbl_slt WHERE lehrerkuerzel = ${db.escape(req.body.lehrerid)}`,
        async (zwtblErr, zwtblResult) => {
            if (zwtblErr) {
                return res.status(400).send({
                    msg: zwtblErr
                })
            }

            if (!zwtblResult.length) {
                return res.status(400).send({
                    msg: `Beim dem Lehrer ${req.body.lehrerid} sind keine Termine vorhanden.`
                })
            }

            for (let i = 0; i < zwtblResult.length; i++) {
                try {
                    let termin = {
                        sltid: zwtblResult[i].sltid,
                        schuelerid: zwtblResult[i].schuelerid,
                        lehrerid: zwtblResult[i].lehrerid,
                        uhrzeit: await getUhrzeit(await GetTerminUhrzeitstart(zwtblResult[i].terminid), await GetTerminUhrzeitende(zwtblResult[i].terminid)),
                        raum: await GetRaum(zwtblResult[i].raumid),
                        datum: await getDatum(zwtblResult[i].datum)
                    }


                    result.push(termin)
                } catch (err) {
                    console.log(err)
                    return res.status(400).send({
                        msg: err
                    })
                }
            }
            return res.status(200).send({
                result
            })
        }
    )
})

function GetSchuelerVorUndNachname(schuelerid) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT vorname, nachname FROM tblschueler WHERE schuelerid = ${db.escape(schuelerid)}`,
            (err, result) => {
                if (err) {
                    return reject("Error in der Datenbank.")
                }

                if (!result.length) {
                    return reject("Kein Schueler mit der Id in der Datenbank.")
                } else {
                    return resolve(result[0].vorname + " " + result[0].nachname)
                }

            }
        )
    })
}

function GetKlasse(schuelerid) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT klassenid FROM tblschueler WHERE schuelerid = ${db.escape(schuelerid)}`,
            (err, result) => {
                if (err) {
                    reject("Error in der Datenbank.")
                }

                if (!result.length) {
                    reject(`Unter dieser Schülerid "${schuelerid}" wurde kein Schüler gefunden.`)
                } else {
                    db.query(`SELECT klasse FROM tblklasse WHERE klassenid = ${db.escape(result[0].klassenid)}`,
                        (klassenErr, klassenResult) => {
                            if (klassenErr) {
                                reject("Error in der Datenbank.")
                            }

                            if (!klassenResult.length) {
                                reject(`Die Klassenid ist nicht in der Datenbank gespeichert.`)
                            } else {
                                resolve(klassenResult[0].klasse)
                            }
                        }
                    )
                }
            }
        )
    })
}

//My appointments student
router.post("/GetMTSchueler", (req, res, next) => {
    var result = []
    db.query(`SELECT * FROM zwtbl_slt WHERE schuelerid = ${db.escape(req.body.schuelerid)}`,
        async (zwtblErr, zwtblResult) => {
            if (zwtblErr) {
                return res.status(400).send({
                    msg: zwtblErr
                })
            }

            if (!zwtblResult.length) {
                return res.status(400).send({
                    msg: "Sie haben zurzeit keine reservierten Termine."
                })
            }

            for (let i = 0; i < zwtblResult.length; i++) {
                try {
                    let termine = {
                        sltid: zwtblResult[i].sltid,
                        lehrerkuerzel: zwtblResult[i].lehrerkuerzel,
                        uhrzeit: await getUhrzeit(await GetTerminUhrzeitstart(zwtblResult[i].terminid), await GetTerminUhrzeitende(zwtblResult[i].terminid)),
                        raum: await GetRaum(zwtblResult[i].raumid),
                        datum: await getDatum(zwtblResult[i].datum)
                    }


                    result.push(termine)
                } catch (err) {
                    return res.status(400).send({
                        msg: err
                    })
                }
            }

            return res.status(200).send({
                result
            })
        }
    )
})

//My appointments teacher
router.post("/GetMTLehrer", (req, res, next) => {
    var result = []
    db.query(`SELECT * FROM zwtbl_slt WHERE lehrerkuerzel = ${db.escape(req.body.lehrerkuerzel)} AND schuelerid is not Null`,
        async (zwtblErr, zwtblResult) => {
            if (zwtblErr) {
                return res.status(400).send({
                    msg: zwtblErr
                })
            }

            if (!zwtblResult.length) {
                return res.status(400).send({
                    msg: "Sie haben zurzeit keine Termine."
                })
            }

            for (let i = 0; i < zwtblResult.length; i++) {
                try {

                    let termine = {
                        sltid: zwtblResult[i].sltid,
                        schuelerid: zwtblResult[i].schuelerid,
                        name: await GetSchuelerVorUndNachname(zwtblResult[i].schuelerid),
                        klasse: await GetKlasse(zwtblResult[i].schuelerid),
                        uhrzeit: await getUhrzeit(await GetTerminUhrzeitstart(zwtblResult[i].terminid), await GetTerminUhrzeitende(zwtblResult[i].terminid)),
                        raum: await GetRaum(zwtblResult[i].raumid),
                        datum: await getDatum(zwtblResult[i].datum)
                    }


                    result.push(termine)
                } catch (err) {
                    return res.status(400).send({
                        msg: err
                    })
                }
            }

            return res.status(200).send({
                result
            })
        }
    )
})

router.get("/GetBuecher", (req, res, next) => {
    db.query(`SELECT DISTINCT isbn, title, autor, jahr, verlag FROM tblbuch`,
        (err, result) => {
            if (err) {
                return res.status(400).send({
                    msg: err
                })
            }

            return res.status(200).send({
                result
            })
        }
    )
})

//Get classes
router.get("/GetK", (req, res, next) => {
    db.query(`SELECT * FROM tblklasse`,
        (err, result) => {
            if (err) {
                return res.status(400).send({
                    msg: err
                })
            }

            return res.status(200).send({
                result
            })
        }
    )
})

router.post("/GetSchuelerKlasse", (req, res, next) => {
    db.query(`SELECT schuelerid, vorname, nachname FROM tblschueler WHERE klassenid = ${db.escape(req.body.klassenid)}`,
        (err, result) => {
            if (err) {
                return res.status(400).send({
                    msg: err
                })
            }

            return res.status(200).send({
                result
            })
        }
    )
})

function UeberpruefungBuch(buchnr) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM zwtbl_ausleihbuch WHERE buchnr = ${db.escape(buchnr)} ORDER BY ausleihbuchid`,
            async (err, result) => {
                if (err) {
                    return reject(0)
                }

                if (!result.length) {
                    return resolve(buchnr)
                }

                if (result[result.length - 1].zurueckgegeben == 0) {
                    return reject(0)
                } else {
                    return resolve(buchnr)
                }
            }
        )
    })
}

router.post("/GetBuchNummer", (req, res, next) => {
    var result = []
    db.query(`SELECT buchnr FROM tblbuch WHERE isbn = ${db.escape(req.body.isbn)}`,
        async (buchErr, buchResult) => {
            if (buchErr) {
                return res.status(400).send({
                    msg: buchErr
                })
            }

            for (let i = 0; i < buchResult.length; i++) {
                try {
                    let antwort = await UeberpruefungBuch(buchResult[i].buchnr)
                    if (antwort != 0) {
                        result.push(antwort)
                    }
                } catch (err) {
                    console.log(err)
                }
            }
            console.log(result)
            return res.status(200).send({
                result
            })
        }
    )
})

router.post("/GetVergebeneBuecher", (req, res, next) => {
    ergebnis = []
    db.query(`SELECT za.datum, za.ausleihbuchid, za.zurueckgegeben, s.schuelerid, k.klasse, b.isbn, za.buchnr FROM tblschueler s, zwtbl_ausleihbuch za, tblbuch b, tblklasse k WHERE k.klassenid = s.klassenid AND s.schuelerid = za.schuelerid AND za.buchnr = b.buchnr AND s.schuelerid = ${db.escape(req.body.schuelerid)} ORDER BY datum DESC;`,
        async (err, result) => {
            if (err) {
                return res.status(400).send({
                    msg: "Es ist etwas schief gelaufen."
                })
            }

            if (!result.length) {
                return res.status(400).send({
                    msg: "An diesen Schüler wurden keine Bücher verliehen."
                })
            } else {
                for (let i = 0; i < result.length; i++) {
                    try {
                        if (result[i].zurueckgegeben) {
                            zurueckgegeben = "";
                        } else {
                            zurueckgegeben = null;
                        }
                        zwischenspeicherVariable = {
                            ausleihbuchid: result[i].ausleihbuchid,
                            name: await GetSchuelerVorUndNachname(result[i].schuelerid),
                            klasse: result[i].klasse,
                            isbn: result[i].isbn,
                            buchnr: result[i].buchnr,
                            datum: await getDatum(result[i].datum),
                            zurueckgegeben: zurueckgegeben
                        }
                        console.log(zwischenspeicherVariable)
                        ergebnis.push(zwischenspeicherVariable)
                    } catch (err) {
                        return res.status(400).send({
                            msg: "Es ist etwas schief gelaufen."
                        })
                    }

                }
                return res.status(200).send({
                    ergebnis
                })
            }
        }
    )
})

function BuchInformationen(buchnr){
    return new Promise((resolve, reject) =>{
        db.query(`SELECT s.vorname, s.nachname , k.klasse FROM tblbuch b, zwtbl_ausleihbuch a, tblklasse k, tblschueler s WHERE b.buchnr = a.buchnr AND a.buchnr = ${db.escape(buchnr)} AND a.schuelerid = s.schuelerid AND s.klassenid = k.klassenid`,
            (err, result) => {
                if(err){
                    reject("Es ist etwas schief gelaufen.")
                }

                if(!result.length){
                    resolve("")
                }else{
                    resolve([result[0].vorname + " "+ result[0].nachname , result[0].klasse])
                }
            }
        )
    })
}

router.get("/GetVerliehenesBuch", (req, res, next) => {
    var ergebnis = [];
    db.query(`SELECT * FROM tblbuch`,
        async(err, result) => {
            if(err){
                return res.status(400),send({
                    msg: "Es ist etwas schief gelaufen"
                })
            }
            
            try{
                for(let i = 0 ; i < result.length ; i++){
                    var schueler = await BuchInformationen(result[i].buchnr)
                    console.log(schueler)
                    let zwischenspeicherVariable ={
                        buchnr: result[i].buchnr,
                        isbn: result[i].isbn,
                        title: result[i].title,
                        autor: result[i].autor,
                        jahr: result[i].jahr,
                        verlag: result[i].verlag,
                        schueler: schueler[0],
                        klasse: schueler[1]
                    }
                    ergebnis.push(zwischenspeicherVariable);
                }
            }catch(Error){
                1564768516547685465
                console.log(Error)
                return res.status(400).send({
                    msg: "Es ist etwas schief gelaufen."
                })
            }

            return res.status(200).send({
                result: ergebnis
            })
        }
    )
})

module.exports = router