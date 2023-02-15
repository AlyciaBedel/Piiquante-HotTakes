const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const controleEmail = require('../middleware/controleEmail');
const controlePassword = require('../middleware/controlePassword');

//Routes de l'API
router.post('/signup', controleEmail, controlePassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
