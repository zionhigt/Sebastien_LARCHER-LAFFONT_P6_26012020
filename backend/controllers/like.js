const User = require('../models/User');
const Sauce = require('../models/Sauce');

module.exports.likeHandler = (req, res, next) =>
{
	// On cherche l'utilisateur en BDD
	User.findOne({_id: req.body.userId})
	.then(user => {
		// On cherche la sauce en BDD
		Sauce.findOne({_id: req.params.id})
		.then(sauce => {
			// Selon la valeur de body.like
			switch(req.body.like)
			{
				case -1:
					// si userId n'est pas dans la tableau de dislike  
					if(sauce.usersDisliked.indexOf(user.id) == -1)
					{
						sauce.usersDisliked.push(user.id)// On ajoute l'userId au tableau
						const isInto = sauce.usersLiked.indexOf(user.id);
						if(isInto > -1)// Si l'userId est trouvé dans le tableau des like on le supprime
						{
							sauce.usersLiked.splice(isInto, 1)
						}


					}
					break;

				case 0:

					const isIntoLike = sauce.usersLiked.indexOf(user.id);
					const isIntoDislike = sauce.usersDisliked.indexOf(user.id);
					if(isIntoLike > -1)// Si l'userId est trouvé dans le tableau des like on le supprime
					{
						sauce.usersLiked.splice(isIntoLike, 1);

					}

					if(isIntoDislike > -1)// Si l'userId est trouvé dans le tableau de dislke on le supprime
					{
						sauce.usersDisliked.splice(isIntoDislike, 1);

					}

					break;

				case 1:
					if(sauce.usersLiked.indexOf(user.id) == -1)// Si l'userId n'est pas trouvé dans le tableau des likes on l'ajoute
					{
						sauce.usersLiked.push(user.id)
						const isInto = sauce.usersDisliked.indexOf(user.id);
						if(isInto > -1)// Si l'userId est trouvé dans le tableau des dislikes on le supprime
						{
							sauce.usersDisliked.splice(isInto, 1)
						}


					}
					break;

				default:
					// Si body.like n'a auccune de ces trois valeurs, null est renvoyer a l'utilisateur
					res.status(200).json({message: null});
					break;

			}

			sauce.likes = sauce.usersLiked.length;
			sauce.dislikes = sauce.usersDisliked.length;
			// les quantités de like/dislike sont mis à jour
			sauce.save(sauce)
			.then((sauce) => {
				res.status(200).json({message: "Done !"})
			})
			.catch(error => {res.status(500).json({ error })});
			// Les likes/dislikes de la sauce sont mis à jour
		})
		.catch(error => {res.status(404).json({ error })});


	})
	.catch(error => {res.status(404).json({ error })});
}