const RSA = require('node-rsa')

const key = new RSA({b: process.env.BUFFER_SIZE});
key.importKey(process.env.PRIVATE_KEY, 'pkcs1');
key.importKey(process.env.PUBLIC_KEY, 'pkcs1-public');

module.exports.deciphering = ciphered => {
	const deciphered = key.decryptPublic(ciphered, 'utf8');
	return deciphered;

}
module.exports.ciphering = buffer => {

	const ciphered = key.encryptPrivate(buffer, 'base64');
	return ciphered;
}