//express is for creating a web API.
const express = require('express');
const router = express.Router();

const db = require('../lib/db.js');

//jsonwebtoken is for handeling user sessions.
const jwt = require('jsonwebtoken');

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

module.exports = router