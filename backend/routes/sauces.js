const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const likesCtrl = require('../controllers/like');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const access = require('../middleware/access');

router.get('/', access.access('user'), saucesCtrl.getAll);
router.get('/:id', access.access('user'), saucesCtrl.getOneById);

router.post('/', access.access('user'), multer, auth, saucesCtrl.postOne);
router.post('/:id/like', access.access('user'), auth, likesCtrl.likeHandler);

router.put('/:id', access.access('admin'), auth, saucesCtrl.updateOneById);

router.delete('/:id', access.access('admin'), auth, saucesCtrl.deleteOneById);

module.exports = router;