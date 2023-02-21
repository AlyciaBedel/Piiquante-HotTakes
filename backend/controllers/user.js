// Importation des modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cryptojs = require('crypto-js');
const User = require('../models/User');

dotenv.config();

//Inscription de l'utilisateur
exports.signup = (req, res, next) => {
  //Cryptage de l'email
  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, process.env.CRYPTO_JS_EMAIL)
    .toString();

  //Cryptage du mot de passe
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Création d'un utilisateur avec l'email et le mot de passe crypté
      const user = new User({
        email: emailCryptoJs,
        password: hash,
      });
      // Sauvegarde de l'utilisateur dans la BDD
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Connexion de l'utilisateur
exports.login = (req, res, next) => {
  //Cryptage de l'email
  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, process.env.CRYPTO_JS_EMAIL)
    .toString();

  // Recherche de l'utilisateur avec l'email dans la BDD
  User.findOne({ email: emailCryptoJs })
    .then((user) => {
      // Si l'utilisateur pas trouvé, renvoi une erreur
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }

      // Comparer mot de passe entré par l'utilisateur avec le mot de passe dans la BDD
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si les mots de passe ne correspondent pas, renvoi une erreur
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }

          // Si l'authentification est réussie, générer un token et renvoi l'id de l'utilisateur
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWTKEYTOKEN, {
              expiresIn: '24h',
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
