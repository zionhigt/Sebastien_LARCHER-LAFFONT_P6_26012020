const bcrypt = require('bcrypt');

const User = require('../models/User');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ciphering = email => {
	const cipher = crypto.createCipheriv(process.env.ALGORITHM, process.env.CIPHER_KEY);
	console.log(email)
	const cipheredEmail = cipher.update(email, 'utf8', 'hex');
	cipheredEmail += cipher.final('hex');
	return cipheredEmail;
}

const deciphering = ciphered => {
	const decipher = crypo.createDecipheriv('aes256-cbc', process.env.CIPHER_KEY);
	const decipheredEmail = decipher.update(ciphered, 'utf8', 'hex');
	decipheredEmail += decipher.final('utf8');
}

exports.singup = (req, res, next) => {
	bcrypt.hash(req.body.password, 10)
	.then(hash => {
		const user = new User({
			email: ciphering(req.body.email),
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
	User.findOne({email: ciphering(req.body.email)})
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