const express = require('express');
const upload = require('../middlewares/multer');
const { signUp, login, getAllUsers, getUserById, updateUserProfile, googleLogin, facebookLogin } = require('../controllers/userController');
const { AuthenticatorJWT } = require('../middlewares/authenticator');

const router = express.Router();

router.post('/signup', upload.single('file'), signUp);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/facebook-login', facebookLogin);
router.get('/get/:id', getUserById);
router.put('/update/:id', AuthenticatorJWT, upload.single('file'), updateUserProfile);

module.exports = router;