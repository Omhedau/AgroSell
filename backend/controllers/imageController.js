const { generateUploadUrl, generateAccessUrl, deleteImage } = require('../aws-s3/s3Utils');

// Get pre-signed URL for image upload
const getUploadUrl = async (req, res) => {
  try {
    console.log('i am in getUploadUrl');
    const { key, contentType } = req.body; // e.g., key = 'uploads/my-image.jpg'
    const url = await generateUploadUrl(key, contentType);
    res.status(200).json({ uploadUrl: url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
};

// Get pre-signed URL for accessing an image
const getAccessUrl = async (req, res) => {
  try {
    const { key } = req.body; 
    const url = await generateAccessUrl(key);
    res.status(200).json({ accessUrl: url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate access URL' });
  }
};

// Delete an image from S3
const deleteImageByKey = async (req, res) => {
  try {
    const { key } = req.body; // e.g., key = 'uploads/my-image.jpg'
    await deleteImage(key);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

module.exports = { getUploadUrl, getAccessUrl, deleteImageByKey };
