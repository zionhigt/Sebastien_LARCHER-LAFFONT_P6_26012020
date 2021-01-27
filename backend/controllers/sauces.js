const Sauce = require('../models/Sauce');

const fs = require('fs');


// CREE une sauce
exports.postOne = (req, res, next) =>{
	const sauceObjet =JSON.parse(req.body.sauce);
	delete sauceObjet._id;
	const sauce = new Sauce(
	{
		...sauceObjet,
		imageUrl: req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
	});
	sauce.save(sauce)
	.then(()=> res.status(201).json({message: "Objet enregistré"}))
	.catch(error => res.status(400).json({error}));
};

// Recupére toutes les sauces
exports.getAll = (req, res, next) =>{
	Sauce.find()
	.then(sauces => {
		res.status(200).json(sauces);
	})
	.catch(error => {res.status(404).json({ error })});
};

// Récupére une sauce par son id
exports.getOneById = (req, res, next) =>{
	Sauce.findOne({_id: req.params.id})
	.then(sauce => {
		res.status(200).json(sauce);
	})
	.catch(error => {res.status(404).json({ error })});
};

// Une mis à jour de la sauce
exports.updateOneById = (req, res, next) =>{
	const sauceObjet =JSON.parse(req.body.sauce);
	const sauce = new Sauce(
	{
		...sauceObjet,
		imageUrl: req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
	});
	Sauce.findOne({_id: req.params.id})
	.then(sauce => {
		const filename = sauce.imageUrl.split('/images/')[1];
		fs.unlink("images/"+ filename, () => {
			Sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id})
			.then(() => res.status(200).json({ message: 'Objet modifié !'}))
			.catch(error => res.status(400).json({ error }));
		});
	})
	.catch(error => res.status(500).json({ error }));
};

// Détruit la resource en base de donneé
exports.deleteOneById = (req, res, next) =>{
	const sauceObjet =JSON.parse(req.body.sauce);
	Sauce.findOne({_id: req.params.id})
	.then(sauce => {
		const filename = sauce.imageUrl.split('/images/')[1];
		fs.unlink("images/"+ filename, () => {
			Sauce.deleteOne({ _id: req.params.id })
			.then(() => res.status(200).json({ message: 'Objet supprimé !'}))
			.catch(error => res.status(400).json({ error }));
		});
	})
	.catch(error => res.status(500).json({ error }));
};