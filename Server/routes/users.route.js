const router = require('express').Router();
require('dotenv').config();

const upload = require('../configs/multer')
const usersController = require('../controllers/usersController')

// pass role and avatar to client [GET] /info
router.get('/info', usersController.userInfo)

// pass full profile od user [GET] /info-full
router.get('/info-full', usersController.userInfoFull)

// update user's profile [POST] /update
router.post('/update', usersController.userUpdateProfile)

// change password [POST] /change-password
router.post('/change-password', usersController.changePassword)

// upload new avatar [POST] /update-avatar
router.post('/update-avatar', upload.single("image"), usersController.updateAvatar)

module.exports = router
