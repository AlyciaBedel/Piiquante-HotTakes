# Projet 6 : Piiquante - HotTakes!

Sixième projet du parcours "Développeur web" chez OpenClassroom. L'objectif est de construire une API sécurisée pour une application d'avis gastronomique.

<img src="https://user-images.githubusercontent.com/98737248/217843411-8a7882af-1628-4fbe-bca0-dbc78b7cb737.svg" style="height:35px;"> [![forthebadge](https://forthebadge.com/images/badges/powered-by-coffee.svg)](https://forthebadge.com)

![Hot-Sauce-Eshop-front-scaled](https://user-images.githubusercontent.com/98737248/217837620-787a1ee3-6920-49b5-a971-2302df4fb647.jpg)

## Qui est Piiquante et HotTakes ?

Piiquante se dédie à la création de sauces épicées dont les recettes sont gardées secrètes. Pour tirer parti de son succès et générer davantage de buzz, l'entreprise souhaite créer une application web appelée « Hot Takes », dans laquelle les utilisateurs peuvent ajouter leurs sauces préférées et liker ou disliker les sauces ajoutées par les autres.

## Objectifs

1. Mettre en œuvre des opérations CRUD de manière sécurisée.
2. Stocker des données de manière sécurisée.
3. Implémenter un modèle logique de données conformément à la réglementation.

## Technologies

- Node.js
- Javascript
- MongoDB Atlas pour la BDD

## Librairies utilisées

Bcrypt : version 5.1.0.
Cors : version 2.8.5.
Express : version 4.18.2.
Jsonwebtoken : version 9.0.0.
Mongoose : version 6.9.1.
Mongoose-unique-validator : version 3.1.0.
Multer : version 1.4.5-lts.1.

## Exigences de sécurité

- Le mot de passe de l'utilisateur doit être haché.
- L'authentification doit être renforcée sur toutes les routes sauce requises.
- Les adresses électroniques dans la base de données sont uniques et un plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler les erreurs.
- La sécurité de la base de données MongoDB (à partir d'un service tel que MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la machine d'un utilisateur.
- Un plugin Mongoose doit assurer la remontée des erreurs issues de la base de données.
- Les versions les plus récentes des logiciels sont utilisées avec des correctifs de sécurité actualisés.
- Le contenu du dossier images ne doit pas être téléchargé sur GitHub.

## Installation du projet

À venir.
