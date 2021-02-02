const multer = require('multer');

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp'
}

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images')
	},
	filename: (req, file, callback) => {
		const name = file.originalname.split(' ').join('_').split('.')[0]+"_";
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + '.' + extension);
	}
});

const memory  = multer.memoryStorage();

if(process.env.NODE_ENV == "test")
{
	module.exports = multer({ memory }).single('image');	

}
else
{
	module.exports = multer({ storage }).single('image');	

}