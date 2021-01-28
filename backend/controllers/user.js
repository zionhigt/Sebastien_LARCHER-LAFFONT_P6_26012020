const bcrypt = require('bcrypt');

const User = require('../models/User');

const jwt = require('jsonwebtoken');

const RSA = require('node-rsa')

const NodeRSA = require('node-rsa');

const key = new RSA({b: process.env.BUFFER_SIZE});
key.importKey(process.env.PRIVATE_KEY, 'pkcs1');
key.importKey(process.env.PUBLIC_KEY, 'pkcs1-public');

const deciphering = ciphered => {
	const deciphered = key.decryptPublic(ciphered, 'utf8');
	return deciphered;

}
const ciphering = buffer => {

	const ciphered = key.encryptPrivate(buffer, 'base64');
	return ciphered;
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