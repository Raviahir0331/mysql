const Photo = require('../Model/fileModel');
const fs = require('fs');
const path = require('path');

// Upload a photo
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const newPhoto = new Photo({
      name: req.body.name,
      photo: req.file.filename, // Save filename to database
    });
    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a photo
exports.updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    // Delete the old file
    if (photo.photo) {
      fs.unlinkSync(path.join(__dirname, '../uploads', photo.photo));
    }

    photo.name = req.body.name || photo.name;
    photo.photo = req.file ? req.file.filename : photo.photo;

    await photo.save();
    res.status(200).json(photo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a photo
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    // Delete the file
    fs.unlinkSync(path.join(__dirname, '../uploads', photo.photo));

    await photo.remove();
    res.status(200).json({ message: 'Photo deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all photos
exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find();
    res.status(200).json(photos);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
