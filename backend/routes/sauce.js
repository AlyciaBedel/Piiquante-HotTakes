//Importation du module
const express = require('express');
const router = express.Router();

//Middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Controller
const sauceCtrl = require('../controllers/sauce');

//Routes de l'API
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;
