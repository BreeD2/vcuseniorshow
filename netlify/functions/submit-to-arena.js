const axios = require('axios');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your cloud name, API key, and API secret
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let imageUrl, imageTitle, imageDescription;

  // Handle JSON body for URL submissions or base64 encoded image for file uploads
  const body = JSON.parse(event.body);
  imageTitle = body.imageTitle;
  imageDescription = body.imageDescription;

  if (body.imageFile) {
    // Assume imageFile is a base64-encoded string
    try {
      const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${body.imageFile}`, {
        folder: "your_folder_name" // Optional: specify a folder in Cloudinary
      });
      imageUrl = uploadResponse.secure_url; // Use the URL provided by Cloudinary
    } catch (uploadError) {
      console.error('Cloudinary upload failed:', uploadError);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to upload image to Cloudinary." })
      };
    }
  } else if (body.imageUrl) {
    imageUrl = body.imageUrl;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No image URL or file provided." })
    };
  }

  const token = process.env.ARENA_ACCESS_TOKEN;
  if (!token) {
    console.error('ARENA_ACCESS_TOKEN is not defined.');
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error: Missing Are.na access token." })
    };
  }

  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    const response = await axios.post(`https://api.are.na/v2/channels/vcu-senior-show-2024/blocks`, {
      source: imageUrl,
      description: `${imageTitle}\n\n${imageDescription}`
    }, { headers });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Image submitted successfully to Are.na." })
    };
  } catch (error) {
    console.error('Error submitting to Are.na:', error);
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        message: "Failed to submit image to Are.na.",
        error: error.message,
        detail: error.response?.data
      })
    };
  }
};
