//express is for creating a web API.
const express = require('express');
const router = express.Router();

const db = require('../lib/db.js');

//jsonwebtoken is for handeling user sessions.
const jwt = require('jsonwebtoken');

router.post("/SetTermine", (req, res, next) => {
    
})