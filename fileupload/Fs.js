// src/components/ImageForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fs = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedImage || !description) return;

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('description', description);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/photos');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/photo/${id}`);
      fetchImages(); 
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleUpdate = async (id) => {
    if (!selectedImage || !description) return;

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('description', description);

    try {
      await axios.put(`http://localhost:5000/photo/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchImages(); 
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <h1>Upload Image</h1>
      <input type="text" value={description} onChange={handleDescriptionChange} placeholder="Description" />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>

      <h2>Uploaded Images</h2>
      <ul>
        {images.map((image) => (
          <li key={image._id}>
            <img src={`http://localhost:5000/${image.path}`} alt={image.description} style={{width:'50px',height:'50px',borderRadius:'60px'}} />
            <p>{image.description}</p>
            <button onClick={() => handleDelete(image._id)}>Delete</button>
            <button onClick={() => handleUpdate(image._id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Fs;
