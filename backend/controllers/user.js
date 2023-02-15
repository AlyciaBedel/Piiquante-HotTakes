const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cryptojs = require('crypto-js');

dotenv.config();

const User = require('../models/User');

//Inscription de l'utilisateur
exports.signup = (req, res, next) => {
  //Chiffrer l'email avant de l'envoyer dans la BDD
  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, process.env.CRYPTO_JS_EMAIL)
    .toString();

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: emailCryptoJs,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Connexion de l'utilisateur
exports.login = (req, res, next) => {
  //Chiffrer l'email avant de l'envoyer dans la BDD
  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, process.env.CRYPTO_JS_EMAIL)
    .toString();

  User.findOne({ email: emailCryptoJs })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
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
