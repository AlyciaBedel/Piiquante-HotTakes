const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Crée une application express
const app = express();

app.use(morgan('combined'));

//Connexion à notre BDD
mongoose
  .connect(
    'mongodb+srv://' +
      process.env.DB_USERNAME +
      ':' +
      process.env.DB_PASSWORD +
      '@clusteralycia.he6mvun.mongodb.net/' +
      process.env.DB_NAME +
      '?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
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

//Parser les réponses en JSON
app.use(express.json());

//Les différentes routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

//Exportation de app.js pour accéder dans un autre fichier
module.exports = app;
