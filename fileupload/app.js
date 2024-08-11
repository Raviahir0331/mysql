const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const url =
  "mongodb://mongoadmin:mongoadmin@localhost:27017/share_&_hub?authSource=admin";

const app = express();
app.use(cors());
app.use(express.json());

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// MongoDB connection
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define a Mongoose schema and model
const imageSchema = new mongoose.Schema({
  path: String,
  filename: String,
  description: String,
});
const Image = mongoose.model("Image", imageSchema);

// Upload image
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const image = new Image({
      path: req.file.path,
      filename: req.file.filename,
      description: req.body.description,
    });
    await image.save();
    res.status(200).json({ message: "Image uploaded successfully", image });
  } catch (err) {
    res.status(500).send("Error uploading image.");
  }
});

// Update image by ID
app.put("/photo/:id", upload.single("image"), async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).send("Image not found.");

    // Check if a new image file is uploaded and delete the old one
    if (req.file) {
      const absolutePath = path.resolve(image.path);
      console.log('Trying to delete old file at:', absolutePath);

      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }

      // Update the path and filename to the new file
      image.path = req.file.path;
      image.filename = req.file.filename;
    }

    // Update the description if provided
    if (req.body.description) {
      image.description = req.body.description;
    }

    // Save the updated image details
    await image.save();

    res.status(200).json({ message: "Image updated successfully", image });
  } catch (err) {
    res.status(500).json({ message: 'Error updating image', err });
    console.log('Error:', err);
  }
});


// Delete image by ID
app.delete("/photo/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).send("Image not found.");

    // Resolve the absolute path and check if the file exists
    const absolutePath = path.resolve(image.path);
    console.log('Trying to delete file at:', absolutePath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    } else {
      console.log('File not found, skipping deletion.');
    }

    // Use findByIdAndDelete to remove the document
    await Image.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting image', err });
    console.log('Error:', err);
  }
});



// Get all photos
app.get("/photos", async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (err) {
    res.status(500).send("Error retrieving images.");
  }
});

// Serve static files
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
