// Objet de verification de sécurité
const safePattern = {
	id: {grep: /\S/ , type: "string", default: ""},
	userId: {grep: /\S/ , type: "string", default: ""},
	email: {grep: /\S+@\S+\.\S+/ , type: "string", default: ""},
	password: {grep: /^/ , type: "string", default: ""},
	name: {grep: /^/ , type: "string", default: ""},
	manufacturer: {grep: /\S/ , type: "string", default: ""},
	mainPepper: {grep: /\S/ , type: "string", default: ""},
	imageUrl: {grep: /^/ , type: "string", default: ""},
	heat: {grep: /^/ , type: "number", default: 0},
	like: {grep: /^/ , type: "number", default: 0}
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
				// On garde la valeur si la donnée est parser en tand que nombre entier
				// On definie sa valeur par default si un autre type de donnée est rencontré
				req[where][i] = (typeof(JSON.parse(req[where][i])) == "number") ? req[where][i] : safePattern[i].default;
			}
			catch
			{

				if(typeof(req[where][i]) === safePattern[i].type)
				{
					// Si la donnée est du type attendu....
					// On garde la valeur si elle match avec sa regex respective
					// On definie sa valeur par default si le pattern n'est pas respecté

					req[where][i] = safePattern[i].grep.test(req[where][i]) ? req[where][i] : safePattern[i].default;
				}
				else
				{
					// Si non on definie la valeur par default
					req[where][i] = safePattern[i].default;
				}
			}
		} 
		// On passe au controlleur suivant avec une requête formatée
		next();
	}
};