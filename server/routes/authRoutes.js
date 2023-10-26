const express = require('express')
const User = require('../modals/userModal');

const router= express.Router();

const {signUp , Login , getAllUser} = require('../controller/authController');
const {protect} = require('../middlewares/authProtect');

router.post('/signup',signUp)
router.post('/login',Login)
router.get('/fetchuser',protect,getAllUser);

module.exports = router;