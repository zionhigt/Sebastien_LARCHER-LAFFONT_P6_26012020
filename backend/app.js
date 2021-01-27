const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces')

const path = require('path');


mongoose.connect('mongodb+srv://root:110690@cluster0.wvn0x.mongodb.net/piquante?retryWrites=true&w=majority', 
{
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(()=>console.log('Connexion à mongoDB réussis !'))
.catch(()=>console.log('Connexion à mongoDB échouée !'));
//Connection à la base de données

const app = express();

app.use((req, res, next)=>{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});
// Definis les header acceptés

app.use(bodyParser.json());
// Middleware pour parser les bodies 

/////////////// Joining routes ///////////////////////
app.use('/images', express.static(path.join(__dirname, 'images')));// Definie le dossier images en static
app.use('/api/auth', userRoutes);// connecte les routes auth
app.use('/api/sauces', sauceRoutes);// connecte les routes sauces

module.exports = app;