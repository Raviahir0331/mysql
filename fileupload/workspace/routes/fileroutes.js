const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const photoController = require('../Controller/fsController');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp for unique filenames
  },
});

const upload = multer({ storage: storage });

// Define routes
router.post('/upload', upload.single('photo'), photoController.uploadPhoto);
router.put('/update/:id', upload.single('photo'), photoController.updatePhoto);
router.delete('/delete/:id', photoController.deletePhoto);
router.get('/photos', photoController.getPhotos);

module.exports = router;
