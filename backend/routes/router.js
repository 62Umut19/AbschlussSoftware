//express is for creating a web API.
const express = require('express');
const router = express.Router();

//bcryptjs is for encrypting/decrypting passwords.
const bcrypt = require('bcryptjs');
//uuid is for creating IDs for later users.
const uuid = require('uuid');
//jsonwebtoken is for handeling user sessions.
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');

module.exports = router;