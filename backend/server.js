const http = require('http');
const app = require('./app');

// retourne un port en nombre entier et en base decimal
const normalizePort = val => {
	const port = parseInt(val, 10);
	if(isNaN(port))
	{
		return val;
	}
	if(port >= 0)
	{
		return port;
	}

	return false;
};

const port = normalizePort(process.env.PORT || '3000');//Definie le port selon une variable d'environnement ou definit le port 3000
app.set('port', port);//Defini le port d'ecoute du serveur

////////////////////////Gestionaire d'erreurs/////////////////////////
const errorHandler = error => {
	if(error.syscall !== "listen")
	{
		throw error;
	}
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

	switch (error.code)
	{
		case 'EACCES':
			console.error(bind + ' required elevated privileges.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
};
const server = http.createServer(app);//initialise un serveur http

server.on('error', errorHandler);// Callback en cas d'erreurs
server.on('listening', ()=>{
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
	console.log('Listening on' + bind);
})

// le serveur ecoute sur le port 'port'
server.listen(port);