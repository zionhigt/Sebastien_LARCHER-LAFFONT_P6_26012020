const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const access = require('../middleware/access')
const stringParser = require('../middleware/stringParser');

router.post('/signup', stringParser.secure('body'), userCtrl.singup);// connecte la routes signup
router.post('/login', stringParser.secure('body'), userCtrl.login);// connecte la routes login


module.exports = router;