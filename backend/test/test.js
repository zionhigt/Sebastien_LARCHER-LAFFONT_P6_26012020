const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const server = require('../app');
const User = require('../models/User');
const Sauce = require('../models/Sauce');

chai.use(chaiHttp);

describe('Sauce', () => {
	beforeEach(done => {
		Sauce.deleteMany({}, () => {
			done();
		})
	});

	//////Start tests/////////////////
	describe('/GET Sauces', () => { // La suite de tests pour la route GET
	    it('Ne doit pas lever d\'erreur quand la BDD est vide', (done) => {
	      chai.request(server).get('/api/sauces/test').end((err, res) => { // On requète la route GET
	        res.should.have.status(200); // On vérifie le statu de la réponse
	        res.body.should.be.a('array'); // On vérifie que le résultat est un tableau
	        res.body.length.should.be.eql(0); // On vérifie que la longueur du tableau est de 0
	        done(); // On dit à mocha que l'on a fini nos assertions
	      });
	    });

	    it('Doit retournée tout les items quand la BDD contient deux items', (done) => { // Test qui vérifie qu'on a le bon résultat lorsqu'il y a deux items dans la base de données
	      const firstSauce= new Sauce({
	        name : 'firstSauce',
	        manufacturer : 'test1',
	        userId : mongoose.Types.ObjectId(),
	        description : 'testing',
	        mainPepper : 'test',
	        imageUrl : 'test',
	        heat : 0,
	        likes : 0,
	        dislikes : 0,
	        usersLiked : [],
	        usersDisliked : []
	      });
	      const secondSauce = new Sauce({
	       	name : 'SecondeSauce',
	        manufacturer : 'test2',
	        userId : mongoose.Types.ObjectId(),
	        description : 'testing',
	        mainPepper : 'test',
	        imageUrl : 'test',
	        heat : 0,
	        likes : 0,
	        dislikes : 0,
	        usersLiked : [],
	        usersDisliked : []
	      });
	      firstSauce.save(() => { // On sauvegarde les items dans la base de données
	        secondSauce.save(() => {
	          chai.request(server).get('/api/sauces/test').end((err, res) => {
	            res.should.have.status(200);
	            res.body.should.be.a('array');
	            res.body.length.should.be.eql(2);
	            res.body[0].name.should.be.eql(firstSauce.name);
	            res.body[0].manufacturer.should.be.eql(firstSauce.manufacturer);
	            res.body[0].userId.should.be.eql(firstSauce.userId);
	            res.body[0].description.should.be.eql(firstSauce.description);
	            res.body[0].mainPepper.should.be.eql(firstSauce.mainPepper);
	            res.body[0].imageUrl.should.be.eql(firstSauce.imageUrl);
	            res.body[0].heat.should.be.eql(firstSauce.heat);
	            res.body[0].likes.should.be.eql(firstSauce.likes);
	            res.body[0].dislikes.should.be.eql(firstSauce.dislikes);
	            res.body[0].usersLiked.should.be.eql(firstSauce.usersLiked);
	            res.body[0].usersDisliked.should.be.eql(firstSauce.usersDisliked);

	            res.body[1].name.should.be.eql(secondSauce.name);
	            res.body[1].manufacturer.should.be.eql(secondSauce.manufacturer);
	            res.body[1].userId.should.be.eql(secondSauce.userId);
	            res.body[1].description.should.be.eql(secondSauce.description);
	            res.body[1].mainPepper.should.be.eql(secondSauce.mainPepper);
	            res.body[1].imageUrl.should.be.eql(secondSauce.imageUrl);
	            res.body[1].heat.should.be.eql(secondSauce.heat);
	            res.body[1].likes.should.be.eql(secondSauce.likes);
	            res.body[1].dislikes.should.be.eql(secondSauce.dislikes);
	            res.body[1].usersLiked.should.be.eql(secondSauce.usersLiked);
	            res.body[1].usersDisliked.should.be.eql(secondSauce.usersDisliked);
	            done();
	          });
	        });
	      });
	    });

	    it('Doit renvoyer l\'objet qui corespond à l\'identifiant fourni', done => {
	    	const testSauce = new Sauce({
		        _id : mongoose.Types.ObjectId(),
		       	name : 'uniqueSauce',
		        manufacturer : 'test',
		        userId : mongoose.Types.ObjectId(),
		        description : 'testing',
		        mainPepper : 'test',
		        imageUrl : 'test',
		        heat : 0,
		        likes : 0,
		        dislikes : 0,
		        usersLiked : [],
		        usersDisliked : []
		      });
	    	testSauce.save(() => {
	    		chai.request(server).get('/api/sauces/test/'+testSauce._id).end((err, res) => {
	    			res.should.have.status(200);
		            res.body.should.be.a('Object');
		            res.body.name.should.be.eql(testSauce.name);
		            res.body.manufacturer.should.be.eql(testSauce.manufacturer);
		            res.body.userId.should.be.eql(testSauce.userId);
		            res.body.description.should.be.eql(testSauce.description);
		            res.body.mainPepper.should.be.eql(testSauce.mainPepper);
		            res.body.imageUrl.should.be.eql(testSauce.imageUrl);
		            res.body.heat.should.be.eql(testSauce.heat);
		            res.body.likes.should.be.eql(testSauce.likes);
		            res.body.dislikes.should.be.eql(testSauce.dislikes);
		            res.body.usersLiked.should.be.eql(testSauce.usersLiked);
		            res.body.usersDisliked.should.be.eql(testSauce.usersDisliked);
	    			done();

	    		});
	    	});
	    });
	///////////////END GET/ Sauces///////////////////////
	});

	describe('POST/ Sauces', () => {
		it('Doit insérer une sauce dans la BDD.', done =>{
			const postSauce ={
		        _id : mongoose.Types.ObjectId(),
		        name : 'postSauce',
		        manufacturer : 'test1',
		        userId : mongoose.Types.ObjectId(),
		        description : 'testing',
		        mainPepper : 'test',
		        imageUrl : 'test',
		        heat : 0,
		        likes : 0,
		        dislikes : 0,
		        usersLiked : [],
		        usersDisliked : []
		     };
		     
			chai.request(server).post('/api/sauces/test')
			.set('content-type', 'application/json')
			.attach('image', './images/test.jpg', 'test.jpg')
			.field('sauce', JSON.stringify(postSauce)).end((err, res) => {
				res.should.have.status(201);
				Sauce.findOne({name: postSauce}, sauce => {
					sauce.value.name.should.be.eql(postSauce.name);
		            sauce.value.manufacturer.should.be.eql(postSauce.manufacturer);
		            sauce.value.userId.should.be.eql(postSauce.userId);
		            sauce.value.description.should.be.eql(postSauce.description);
		            sauce.value.mainPepper.should.be.eql(postSauce.mainPepper);
		            sauce.value.imageUrl.should.be.eql(postSauce.imageUrl);
		            sauce.value.heat.should.be.eql(postSauce.heat);
		            sauce.value.likes.should.be.eql(postSauce.likes);
		            sauce.value.dislikes.should.be.eql(postSauce.dislikes);
		            sauce.value.usersLiked.should.be.eql(postSauce.usersLiked);
		            sauce.value.usersDisliked.should.be.eql(postSauce.usersDisliked);
					done();
				});
			});
		});
	////////////END POST/ Sauces////////////////////////
	});

	describe('PUT/ Sauces', () => {
		it('Doit modifier une sauce dans la BDD.', done =>{
			const postSauce = {
		        _id : mongoose.Types.ObjectId(),
		        name : 'postSauce',
		        manufacturer : 'test1',
		        userId : '6016e4e2e1e82b0f50b640fd',
		        description : 'testing',
		        mainPepper : 'test',
		        imageUrl : 'test',
		        heat : 0,
		        likes : 0,
		        dislikes : 0,
		        usersLiked : [],
		        usersDisliked : []
		     };
		    const postObject = new Sauce({...postSauce});

		    const postSauceModified ={
		        name : 'postSauceModified',
		        manufacturer : 'test1Modified',
		        userId : '6016e4e2e1e82b0f50b640fd',
		        description : 'testingModified',
		        mainPepper : 'testModified',
		        imageUrl : 'testModified',
		        heat : 0,
		        likes : 0,
		        dislikes : 0,
		        usersLiked : [],
		        usersDisliked : []
		    };
		    postObject.save(() => {

		    	chai.request(server).put('/api/sauces/test/'+postSauce._id)
		    	.set('content-type', 'application/json')
		    	.attach('image', './images/test.jpg', 'test.jpg')
		    	.field('sauce', JSON.stringify(postSauceModified)).end((err, res) => {
		    		res.should.have.status(200);
		    		done();
		    	});
		    });
		});
		//////////////////////////////END PUT/ Sauces/////////////////////////////////
	});

	describe('DELETE/ Sauce', () => {
		it('Doit supprimer une sauce par son id', done => {
			const postSauce = {
		        _id : mongoose.Types.ObjectId(),
		        name : 'postSauce',
		        manufacturer : 'test1',
		        userId : '6016e4e2e1e82b0f50b640fd',
		        description : 'testing',
		        mainPepper : 'test',
		        imageUrl : 'test',
		        heat : 0,
		        likes : 0,
		        dislikes : 0,
		        usersLiked : [],
		        usersDisliked : []
		     };
		    const postObject = new Sauce({...postSauce});

		    postObject.save(() => {

		    	chai.request(server).delete('/api/sauces/test/'+postSauce._id).end((err, res) => {
		    		res.should.have.status(200);
		    		Sauce.findOne({_id: postSauce._id}, sauce => {
						should.not.exist(sauce);
						done();
					});
		    	});
		    });
		});
		/////////////////////////////END DELETE/ Sauces//////////////////////////////////////////
	});
});



