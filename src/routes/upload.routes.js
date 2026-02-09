const express = require('express');
const router = express.Router();
const { uploadCv } = require('../controllers/upload.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

// POST /api/cvs/upload
router.post('/upload', authMiddleware, upload.single('cv'), uploadCv);

module.exports = router;