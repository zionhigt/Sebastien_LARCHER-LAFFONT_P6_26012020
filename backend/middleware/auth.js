// authorization
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>
{
	try
	{	let body = {}
		if(req.body.sauce)
		{
			body = {...JSON.parse(req.body.sauce)};
		}
		else if(req.body)
		{
			body = {...req.body}
		}
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
		const userId = decodedToken.userId;
		if(body.userId && body.userId === userId)
		{
			next();
		}
		else
		{
			throw  "Not allowed";
		}
	}
	catch(error)
	{
		res.status(403).json({  error });
	}

}