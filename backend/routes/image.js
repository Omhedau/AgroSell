const express = require('express');
const router = express.Router();
// const validateToken = require('../middleware/validateTokenHandler');
const {getUploadUrl, getAccessUrl, deleteImageByKey } = require('../controllers/imageController');
console.log('image.js');
// router.use(validateToken);
router.get('/upload', getUploadUrl);
router.get('/', getAccessUrl);
router.delete('/', deleteImageByKey);



module.exports = router;