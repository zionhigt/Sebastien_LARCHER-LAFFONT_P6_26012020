const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const likesCtrl = require('../controllers/like');
const redirect = require('../controllers/redirectTest');

const auth = require('../middleware/auth');
const access = require('../middleware/access');
const multer = require('../middleware/multer-config');
const stringParser = require('../middleware/stringParser');


router.get('/', saucesCtrl.getAll);
router.get('/:id', saucesCtrl.getOneById);
router.post('/', multer, saucesCtrl.postOne);
router.post('/:id/like', likesCtrl.likeHandler);
router.put('/:id', multer, saucesCtrl.updateOneById);
router.delete('/:id', saucesCtrl.deleteOneById);

router.post('/data/:id', stringParser.secure("body"), stringParser.secure('params'), redirect);

module.exports = router;