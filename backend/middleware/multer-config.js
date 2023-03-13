// Importation du module
const multer = require('multer');

// Les formats des images accepter
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// Configuration de stockage
const storage = multer.diskStorage({
  //Destination de stockage des fichiers
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //Nom du fichier après téléchargement
  filename: (req, file, callback) => {
    //Extraire le nom du fichier sans l'extension
    const name = file.originalname.split('.')[0].split(' ').join('_');
    //Récupération de l'extension du fichier
    const extension = MIME_TYPES[file.mimetype];
    //Générer le nom final
    callback(null, name + '_' + Date.now() + '.' + extension);
  },
});

module.exports = multer({ storage: storage }).single('image');