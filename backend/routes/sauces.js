const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const likesCtrl = require('../controllers/like');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const access = require('../middleware/access');
const stringParser = require('../middleware/stringParser');


router.get('/', 
	stringParser.secure('body'),
	access.access('user'), 
	saucesCtrl.getAll);

router.get('/test', saucesCtrl.getAll);

router.get('/:id',
	stringParser.secure('body'),
	stringParser.secure('params'),
	access.access('user'),
	saucesCtrl.getOneById);
router.get('/test/:id', saucesCtrl.getOneById);

router.post('/',
	stringParser.secure('body'),
	access.access('user'),
	multer,
	auth,
	saucesCtrl.postOne);
router.post('/test', multer, saucesCtrl.postOne);

router.post('/:id/like',
	stringParser.secure('body'),
	stringParser.secure('params'),
	access.access('user'),
	auth,
	likesCtrl.likeHandler);
router.post('/test/:id/like', likesCtrl.likeHandler);

router.put('/:id',
	stringParser.secure('body'),
	stringParser.secure('params'),
	access.access('user'),
	multer,
	auth,
	saucesCtrl.updateOneById);
router.put('/test/:id', multer, saucesCtrl.updateOneById);

router.delete('/:id',
	stringParser.secure('body'),
	stringParser.secure('params'),
	access.access('user'),
	saucesCtrl.deleteOneById);
router.delete('/test/:id', saucesCtrl.deleteOneById);
// Defini les chaînes de middelware pour chaque routes sauces (access, auth, controlleur)

module.exports = router;