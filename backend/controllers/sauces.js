const Sauce = require('../models/Sauce');

const mask = require('../mask/mask')

const fs = require('fs');


// CREE une sauce
exports.postOne = (req, res, next) =>{
	const sauceObjet = JSON.parse(req.body.sauce);
	const sauce = new Sauce(
	{
		userId: req.body.userId,
		...sauceObjet,
		manufacturer: mask.ciphering(sauceObjet.manufacturer),
		imageUrl: req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
	});
	delete sauce._id;
	sauce.save(sauce)
	.then(()=> res.status(201).json({message: "Objet enregistré"}))
	.catch(error => res.status(500).json({error}));
};

// Recupére toutes les sauces
exports.getAll = (req, res, next) =>{
	Sauce.find()
	.then(sauces => {
		for(i in sauces)
		{
			const manufacturer = mask.deciphering(sauces[i].manufacturer);
			sauces[i].manufacturer = manufacturer;
		}
		res.status(200).json(Object.values(sauces));
	})
	.catch(error => {res.status(404).json({ error })});
};

// Récupére une sauce par son id
exports.getOneById = (req, res, next) =>{
	Sauce.findOne({_id: req.params.id})
	.then(sauce => {
		const manufacturer = mask.deciphering(sauce.manufacturer);

		sauce.manufacturer = manufacturer;
		res.status(200).json(sauce);
	})
	.catch(error => {res.status(404).json({ error })});
};

// Une mis à jour de la sauce
exports.updateOneById = (req, res, next) => {
	let sauceObjet;
	try
	{
		JSON.parse(req.body.sauce);
		sauceObjet = {
			...JSON.parse(req.body.sauce),
			imageUrl: req.protocol + '://' + req.get('host') + '/images/' + req.file.filename

		};
	}
	catch
	{
		sauceObjet = {
			...req.body
		};
	}
	sauceObjet.manufacturer = mask.ciphering(sauceObjet.manufacturer);
	Sauce.findOne({_id: req.params.id})
	.then(sauce => {
		if(sauce.userId == sauceObjet.userId)
		{
			if(req.file != undefined)
			{
				const filename = sauce.imageUrl.split('/images/')[1];
				fs.unlink("images/"+ filename, () => {
					Sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id})
					.then(() => res.status(200).json({ message: 'Objet modifié !'}))
					.catch(error => res.status(403).json({ error }));
				});
			}
			else
			{
				Sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id})
					.then(() => res.status(200).json({ message: 'Objet modifié !'}))
					.catch(error => res.status(403).json({ error }));
			}

		}
		else
		{
			res.status(401).json({ error })
		}
	})
	.catch(error => res.status(500).json({ error }));
};

// Détruit la resource en base de donneé
exports.deleteOneById = (req, res, next) =>{
	
	Sauce.findOne({_id: req.params.id})
	.then(sauce => {
		const filename = sauce.imageUrl.split('/images/')[1];
		fs.unlink("images/"+ filename, () => {
			Sauce.deleteOne({ _id: req.params.id })
			.then(() => res.status(200).json({ message: 'Objet supprimé !'}))
			.catch(error => res.status(403).json({ error }));
		});
	})
	.catch(error => res.status(500).json({ error }));
};