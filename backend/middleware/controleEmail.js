const validator = require('validator');

module.exports = (req, res, next) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
    res.writeHead(400, "L'email n'est pas valide.", {
      'content-type': 'application/json',
    });
    res.end("Le format de l'email est incorrect.");
  } else {
    next();
  }
};
