//Import de password-validator
const passwordValidator = require('password-validator');

//Création du schéma
const schema = new passwordValidator();

schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = (req, res, next) => {
  if (!schema.validate(req.body.password)) {
    res.writeHead(
      400,
      'Le mot de passe doit comprendre 8 caractères dont un chiffre, sans espaces',
      {
        'content-type': 'application/json',
      }
    );
    res.end('Le format du mot de passe est incorrect.');
  } else {
    next();
  }
};
