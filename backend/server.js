//Importation des modules
const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();

//Normalise le port en nombre ou en chaîne de caractères
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//Récupère le port sur lequel l'application va tourner
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//Fonction qui gère les erreurs du serveur
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//Lance le serveur en écoutant le port
server.listen(process.env.PORT || 3000, () =>
  console.log(`Serveur ouvert sur le bon port : ${process.env.PORT}`)
);
