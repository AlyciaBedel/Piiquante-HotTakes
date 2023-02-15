const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
  try {
    // Split pour récupérer le TOKEN
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWTKEYTOKEN);
    // Récupération de l'userId du TOKEN
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(403).json({
      error: new Error(': unauthorized request!'),
    });
  }
};
