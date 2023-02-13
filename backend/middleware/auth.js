const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Split pour récupérer le TOKEN
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // Récupération de l'userId du TOKEN
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    rres.status(403).json({
      error: new Error(': unauthorized request!'),
    });
  }
};
