// Importation du module
const Sauce = require('../models/Sauce');

exports.likeSauce = (req, res, next) => {
  // Récupération de l'id utilisateur, id de la sauce et de l'état de like
  const idUser = req.body.userId;
  const idSauce = req.params.id;
  const stateLike = req.body.like;

  // Recherche de la sauce correspondante à l'id dans la BDD
  Sauce.findOne({ _id: idSauce })
    .then((sauce) => {
      // Selon l'état de like, on effectue une action différente
      switch (stateLike) {
        case 1:
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
