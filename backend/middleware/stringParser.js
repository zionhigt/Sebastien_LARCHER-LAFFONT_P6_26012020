// Objet de verification de sécurité
const safePattern = {
	id: {grep: /\S/ , type: "string", default: ""},
	userId: {grep: /\S/ , type: "string", default: ""},
	email: {grep: /\S+@\S+\.\S+/ , type: "string", default: ""},
	password: {grep: /^/ , type: "string", default: ""},
	name: {grep: /^/ , type: "string", default: ""},
	manufacturer: {grep: /\S/ , type: "string", default: ""},
	mainPepper: {grep: /\S/ , type: "string", default: ""},
	description: {grep: /\S/ , type: "string", default: ""},
	imageUrl: {grep: /^/ , type: "string", default: ""},
	heat: {grep: /^/ , type: "number", default: 0},
	like: {grep: /^/ , type: "number", default: 0},
	
};

module.exports.secure = where => {
	return (req, res, next) => {
		
		const reqKeys = Object.keys(req[where]);//On récupere toutes les clés de l'object à analiser
		for(let i of reqKeys)
		{
			try
			{
				// On verifie quil n'y a pas de payload json dans la requête
				JSON.parse(req[where][i]);
				// On garde la valeur si la donnée est parsé en tant que nombre entier
				// On definie sa valeur par default si un autre type de donnée est rencontré
				// On definie sa valeur par default si le pattern n'est pas respecté
				req[where][i] = (typeof(JSON.parse(req[where][i])) == "number" 
								&& typeof(req[where][i]) == safePattern[i].type 
								&& safePattern[i].grep.test(req[where][i])) ? req[where][i] : safePattern[i].default;
			}
			catch
			{

				// Si la donnée est du type attendu....
				// On garde la valeur si elle match avec sa regex
				// On definie sa valeur par default si le pattern n'est pas respecté
				try
				{

					req[where][i] = (typeof(req[where][i]) == safePattern[i].type && safePattern[i].grep.test(req[where][i])) ? req[where][i] : safePattern[i].default;
				}
				catch
				{
					res.satus(403).json({error: "Bad request !"});
				}
			}
		} 
		// On passe au controlleur suivant avec une requête formatée
		next();
	}
};