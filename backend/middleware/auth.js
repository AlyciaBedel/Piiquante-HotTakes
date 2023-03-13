// Importation des modules
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//Vérifie l'authentification de l'utilisateur
module.exports = (req, res, next) => {
  try {
    // Extraire le token du header
    const token = req.headers.authorization.split(' ')[1];
    //Décodage du token avec la clé secrète
    const decodedToken = jwt.verify(token, process.env.JWTKEYTOKEN);
    // Récupération de l'id de l'utilisateur du token
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({
      error: new Error(': unauthorized request!'),
    });
  }
};
