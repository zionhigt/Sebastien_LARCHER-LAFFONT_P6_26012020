const bcrypt = require('bcrypt');

const User = require('../models/User');

const jwt = require('jsonwebtoken');

exports.singup = (req, res, next) => {
	bcrypt.hash(req.body.password, 10)
	.then(hash => {
		const user = new User({
			email: req.body.email,
			password: hash,
			role: 'user'
		})
		user.save()
		.then(()=>res.status(201).json({message: "Utilisateur crée !"}))
		.catch(error => res.status(400).json({ error }))
	})
	.catch(error => {console.error(error); res.status(500).json({ error })})
};

exports.login = (req, res, next) => {
	User.findOne({email: req.body.email})
	.then(user=>{
		if(!user)
		{
			return res.status(401).json({error: "Utilisateur non trouvé !"});
		}
		bcrypt.compare(req.body.password, user.password)
		.then( valide => {
			if(!valide)
			{
				return res.status(401).json({error: "Mot de passe incorrect !"});
			}
			res.status(200).json({
				userId: user._id,
				token: jwt.sign(
					{userId: user._id},
					process.env.SECRET_RANDOM_TOKEN,
					{expiresIn: '24h'}
				)
			});
		})
		.catch(error => res.status(500).json({ error }));
	})
	.catch(error => res.status(500).json({ error }));
};