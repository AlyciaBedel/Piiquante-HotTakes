// Importation des modules
const Sauce = require('../models/Sauce');
const fs = require('fs');

//Création d'une sauce par l'utilisateur
exports.createSauce = (req, res, next) => {
  // Extraite l'objet sauce à partir de la requête et suppression de certaines propriétés
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;

  // Création de l'objet Sauce à partir de l'objet sauce extrait de la requête
  const sauce = new Sauce({
    ...sauceObject,
    // Id de l'utilisateur est ajouté à la sauce
    userId: req.auth.userId,
    // Url de l'image générée à partir des informations de la requête
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  // Sauvegarde de la sauce dans la BDD
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: 'Sauce enregistré !' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Modification d'une sauce existante par l'utilisateur
exports.modifySauce = (req, res, next) => {
  // Vérifie si l'utilisateur a envoyé une nouvelle image et générer la nouvelle url
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  // Supprime la propriété _userId pour éviter la modification de l'id de l'utilisateur
  delete sauceObject._userId;

  // Recherche de la sauce à modifier dans la BDD
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Vérifie si l'utilisateur est le propriétaire de la sauce
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' });
      } else {
        // Mise à jour dans la BDD
        Sauce.updateOne(
          { _id: req.params.id },
          // Ajout de l'id de la sauce dans l'objet à mettre à jour
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Sauce modifié!' }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Supprime une sauce existante par l'utilisateur
exports.deleteSauce = (req, res, next) => {
  // Recherche de la sauce à supprimer dans la BDD
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Vérifie si l'utilisateur est le propriétaire de la sauce
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' });
      } else {
        // Supprime de l'image
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          // Supprime la sauce dans la BDD
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Sauce supprimé !' });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//Affichage d'une des sauces grâce à son ID dans la BDD
exports.getOneSauce = (req, res, next) => {
  // Recherche de la sauce dans la BDD
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//Affichage de toutes les sauces de la BDD
exports.getAllSauces = (req, res, next) => {
  // Recherche de toutes les sauces dans la BDD
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
