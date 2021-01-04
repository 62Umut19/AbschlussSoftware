//express is for creating a web API.
const express = require('express');
const router = express.Router();

const db = require('../lib/db.js');

//jsonwebtoken is for handeling user sessions.
const jwt = require('jsonwebtoken');

//Release busy appointment
router.post("/RemoveTS", (req, res, next) => {
    try{
        db.query(`UPDATE zwtbl_slt SET schuelerid = NULL WHERE schuelerid = ${db.escape(req.body.schuelerid)} AND sltid = ${db.escape(req.body.terminid)}`)
        
        return res.status(200).send({
            msg: "Termin wurde erfolgreich stoniert."
        })
    }
    catch(err){
        return res.status(400).send({
            msg: "Fehlgeschlagen, Termin konnte nicht stoniert werden."
        })
    }
})

module.exports = router