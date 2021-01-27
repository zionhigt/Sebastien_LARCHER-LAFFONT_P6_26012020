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
.then(()=>console.log('Connexion � mongoDB r�ussis !'))
.catch(()=>console.log('Connexion � mongoDB �chou�e !'));
//Connection � la base de donn�es

const app = express();

app.use((req, res, next)=>{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});
// Definis les header accept�s

app.use(bodyParser.json());
// Middleware pour parser les bodies 

/////////////// Joining routes ///////////////////////
app.use('/images', express.static(path.join(__dirname, 'images')));// Definie le dossier images en static
app.use('/api/auth', userRoutes);// connecte les routes auth
app.use('/api/sauces', sauceRoutes);// connecte les routes sauces

module.exports = app;