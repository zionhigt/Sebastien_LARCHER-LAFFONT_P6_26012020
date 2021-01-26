const User = require('../models/User');
const Sauce = require('../models/Sauce');

module.exports.likeHandler = (req, res, next) =>
{
	User.findOne({_id: req.body.userId})
	.then(user => {
		Sauce.findOne({_id: req.params.id})
		.then(sauce => {
			switch(req.body.like)
			{
				case -1:
					if(sauce.usersDisliked.indexOf(user.id) == -1)
					{
						sauce.usersDisliked.push(user.id)
						const isInto = sauce.usersLiked.indexOf(user.id);
						if(isInto > -1)
						{
							sauce.usersLiked.splice(isInto, 1)
						}


					}
					break;

				case 0:

					const isIntoLike = sauce.usersLiked.indexOf(user.id);
					const isIntoDislike = sauce.usersDisliked.indexOf(user.id);
					if(isIntoLike > -1)
					{
						sauce.usersLiked.splice(isInto, 1);

					}
					else if(isIntoDislike > -1)
					{
						sauce.usersDisliked.splice(isInto, 1);

					}
					break;

				case 1:
					if(sauce.usersLiked.indexOf(user.id) == -1)
					{
						sauce.usersLiked.push(user.id)
						const isInto = sauce.usersDisliked.indexOf(user.id);
						if(isInto > -1)
						{
							sauce.usersDisliked.splice(isInto, 1)
						}


					}
					break;

				default:
					res.status(200).json({message: null});
					break;

			}

			sauce.likes = sauce.usersLiked.length
			sauce.dislikes = sauce.usersDisliked.length
			sauce.save(sauce)
			.then((sauce) => {
				console.log(sauce);
				res.status(200).json({message: "Done !"})
			})
			.catch(error => {res.status(500).json({ error })});
		})
		.catch(error => {res.status(404).json({ error })});


	})
	.catch(error => {res.status(404).json({ error })});
}