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

//Like et Dislike
exports.likeSauce = (req, res, next) => {
  // Récupération de l'id utilisateur, id de la sauce et de l'état de like
  const idUser = req.body.userId;
  const idSauce = req.params.id;
  const stateLike = req.body.like;

  // Vérification que l'état de like est autorisé
  const allowedLike = [-1, 0, 1];
  if (!allowedLike.includes(stateLike)) {
    return res.status(400).json({ message: 'Action non autorisé' });
  }

  // Recherche de la sauce correspondante à l'id dans la BDD
  Sauce.findOne({ _id: idSauce })
    .then((sauce) => {
      // Selon l'état de like, on effectue une action différente
      switch (stateLike) {
        case 1:
          if (sauce.usersLiked.includes(idUser) && stateLike === 1) {
            res.status(400).json({ message: 'Action non autorisée' });
            return;
          }

          if ( sauce.usersDisliked.includes(idUser) && stateLike === 1) {
            res.status(400).json({ message: 'Action non autorisée' });
            return;
          }

          //On ajoute un like à la sauce
          if (!sauce.usersLiked.includes(idUser) && stateLike === 1) {
            //Mise à jour de la BDD
            Sauce.updateOne(
              { _id: idSauce },
              { $inc: { likes: 1 }, $push: { usersLiked: idUser } }
            )
              .then(() =>
                res.status(201).json({ message: 'Like +1 à la sauce' })
              )
              .catch((error) => res.status(400).json({ error }));
          }

          break;

        case -1:
          if (sauce.usersLiked.includes(idUser) && stateLike === -1) {
            res.status(400).json({ message: 'Action non autorisée' });
            return;
          }

          //On dislike la sauce
          if (!sauce.usersDisliked.includes(idUser) && stateLike === -1) {
            //Mise à jour de la BDD
            Sauce.updateOne(
              { _id: idSauce },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: idUser },
              }
            )
              .then(() =>
                res.status(201).json({ message: 'Dislike ajouté à la sauce' })
              )
              .catch((error) => res.status(400).json({ error }));
          }

          break;

        case 0:
          if (!sauce.usersDisliked.includes(idUser) && !sauce.usersLiked.includes(idUser)) {
            res.status(400).json({ message: 'Action non autorisée' });
            return;
          }

          //On annule le like si on retire le like
          if (sauce.usersLiked.includes(idUser)) {
            //Mise à jour de la BDD
            Sauce.updateOne(
              { _id: idSauce },
              { $inc: { likes: -1 }, $pull: { usersLiked: idUser } }
            )
              .then(() =>
                res
                  .status(201)
                  .json({ message: 'Vous avez retirer votre like' })
              )
              .catch((error) => res.status(400).json({ error }));
          }
          //On annule le dislike si on retire le like
          if (sauce.usersDisliked.includes(idUser)) {
            //Mise à jour de la BDD
            Sauce.updateOne(
              { _id: idSauce },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: idUser },
              }
            )
              .then(() =>
                res
                  .status(201)
                  .json({ message: 'Vous avez retirer votre dislike' })
              )
              .catch((error) => res.status(400).json({ error }));
          }
          break;
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
