const express = require('express');
const { getAllApplications, getAllApplicationsByUserId, getApplicationById, applyToListing, updateApplication, acceptApplication, deleteApplication } = require('../controllers/applicationController');
const { AuthenticatorJWT } = require('../middlewares/authenticator');

const router = express.Router();
 
router.get('/get/:id', getAllApplications);
router.get('/all-applications/:id', getAllApplicationsByUserId);
router.get('/get/:id', getApplicationById);
router.post('/apply/:id', AuthenticatorJWT, applyToListing);
router.post('/update/:id', AuthenticatorJWT, updateApplication);
router.put('/set-status/:id', AuthenticatorJWT, acceptApplication);
router.delete('/delete/:id', AuthenticatorJWT, deleteApplication);

module.exports = router;