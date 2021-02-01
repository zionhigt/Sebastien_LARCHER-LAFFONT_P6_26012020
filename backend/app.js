const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces')

const limiter = require('./middleware/apiLimiter');
const helmet = require('helmet');

const path = require('path');

mongoose.connect(process.env.DB_CONNECT, 
{
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(()=>{
	if(process.env.NODE_ENV != 'test')
	{
		console.log('Connexion à mongoDB réussis !');
		console.log(process.env.APP_NAME + " est en service");

	}
})
.catch(()=>console.log('Connexion à mongoDB échoué !'));
//Connection à la base de donnés

const app = express();

app.use(helmet());

app.use((req, res, next)=>{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});
// Definis les header accept?
app.use(bodyParser.json());
// Middleware pour parser les bodies 


/////////////// Joining routes ///////////////////////
app.use('/images', express.static(path.join(__dirname, 'images')));// Definie le dossier images en static
app.use('/api/auth', userRoutes);// connecte les routes auth
app.use('/api/sauces', sauceRoutes);// connecte les routes sauces

module.exports = app;