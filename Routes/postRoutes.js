const express = require('express');
const upload = require('../middlewares/multer');
const { AuthenticatorJWT } = require('../middlewares/authenticator');
const { getAllPosts, getAllPostsByUserId, getPostById, uploadPost, updatePost, deletePost, addComments, deletePostComments, getAllCommentsByPostId, addLike, removeLike, addView } = require('../controllers/postController');

const router = express.Router();

router.get('/get', getAllPosts);
router.get('/user/:id', getAllPostsByUserId);
router.get('/get/:id', getPostById);
router.post('/upload', upload.single('file'), AuthenticatorJWT, uploadPost);
router.post('/update/:id', upload.single('file'), AuthenticatorJWT, updatePost);
router.delete('/delete/:id', AuthenticatorJWT, deletePost);

router.post('/add/view/:id', AuthenticatorJWT, addView);

router.post('/add/like/:id', AuthenticatorJWT, addLike);
router.delete('/remove/like/:id', AuthenticatorJWT, removeLike);

router.get('/get/comments/:id', getAllCommentsByPostId);
router.post('/add/comment/:id', AuthenticatorJWT, addComments);
router.delete('/delete/comment/:id', AuthenticatorJWT, deletePostComments);


module.exports = router;