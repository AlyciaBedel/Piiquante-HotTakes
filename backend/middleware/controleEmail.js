// Importation du module
const validator = require('validator');

//Validation du format de l'email
module.exports = (req, res, next) => {
  // Récupération de l'email dans le body
  const { email } = req.body;

  // Vérifie si l'email est valide
  if (!validator.isEmail(email)) {
    res.writeHead(400, "L'email n'est pas valide.", {
      'content-type': 'application/json',
    });
    res.end("Le format de l'email est incorrect.");
  } else {
    next();
  }
};
