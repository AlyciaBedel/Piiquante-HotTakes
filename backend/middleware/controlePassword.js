// Importation du module
const passwordValidator = require('password-validator');

//Création du schéma de validation de mot de passe
const schema = new passwordValidator();

//Schéma avec les règles de validation
schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123']);

module.exports = (req, res, next) => {
  if (!schema.validate(req.body.password)) {
    res.writeHead(
      400,
      'Le mot de passe doit contenir 8 caractères minimum avec des majuscule, des miniscules, des chiffres sans espaces',
      {
        'content-type': 'application/json',
      }
    );
    res.end('Le format du mot de passe est incorrect.');
  } else {
    next();
  }
};
