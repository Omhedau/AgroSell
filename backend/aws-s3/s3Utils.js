const { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = require('../config/s3Config');

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

// Generate a pre-signed URL for uploading an image
const generateUploadUrl = async (key, contentType) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1-hour expiry
  return url;
};

// Generate a pre-signed URL for accessing an image
const generateAccessUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
};

// Delete an image from S3
const deleteImage = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
  return { message: 'Image deleted successfully' };
};

module.exports = { generateUploadUrl, generateAccessUrl, deleteImage };
