
const jwt = require('jsonwebtoken')
const User = require('../models/User');


module.exports.access = role => {
	return (req, res, next) => 
	{
		try
		{
			const token = req.headers.authorization.split(' ')[1];
			const decodedToken = jwt.verify(token, process.env.SECRET_RANDOM_TOKEN);
			const userId = decodedToken.userId;
			User.findOne({_id: userId})
			.then(user => {
				if(user.hasAccess(role))
				{
					next();
				}
				else
				{
					const error = new Error({error: "Access denied !"})
					res.status(403).json({ error })
				}
			})
			.catch(error => res.status(403).json({ error }));
		}
		catch(error)
		{
			res.status(403).json({ error })
		}

	}
}