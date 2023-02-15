const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Crée une application express
const app = express();

//Connexion à notre BDD
mongoose
  .connect(process.env.DB_DATABASE)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Headers pour les requêtes de l'API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

//Morgan pour les logs des requêtes HTTP
app.use(morgan('combined'));

//Parser les réponses en JSON
app.use(express.json());

//Les différentes routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Helmet sécurisation des headers
app.use(helmet());

//Exportation de app.js pour accéder dans un autre fichier
module.exports = app;
