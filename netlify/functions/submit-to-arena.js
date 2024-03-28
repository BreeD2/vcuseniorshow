const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const formidable = require('formidable-serverless');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();

    form.parse(event, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the form data', err);
        return resolve({ statusCode: 500, body: JSON.stringify({ message: "Server Error: Could not parse form data." }) });
      }

      let finalFileUrl = fields.imageUrl; // Use direct imageUrl if provided

      if (files.imageFile && files.imageFile.filepath) {
        try {
          // Specify the folder and resource type based on file type
          let resource_type = 'image'; // Default resource type
          if (files.imageFile.type.startsWith('video')) resource_type = 'video';
          else if (files.imageFile.type === 'application/pdf') resource_type = 'raw';

          const uploadResponse = await cloudinary.uploader.upload(files.imageFile.filepath, {
            resource_type,
            folder: "media",
          });
          finalFileUrl = uploadResponse.secure_url; // Use uploaded file URL
        } catch (error) {
          console.error('Cloudinary upload failed:', error);
          return resolve({ statusCode: 500, body: JSON.stringify({ message: "Failed to upload file to Cloudinary." }) });
        }
      }

      const token = process.env.ARENA_ACCESS_TOKEN;
      if (!token) {
        console.error('ARENA_ACCESS_TOKEN is not defined.');
        return resolve({ statusCode: 500, body: JSON.stringify({ message: "Internal Server Error: Missing Are.na access token." }) });
      }

      try {
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        await axios.post(`https://api.are.na/v2/channels/vcu-senior-show-2024/blocks`, {
          source: finalFileUrl,
          description: `${fields.imageTitle}\n\n${fields.imageDescription}`
        }, { headers });

        return resolve({ statusCode: 200, body: JSON.stringify({ message: "File submitted successfully to Are.na." }) });
      } catch (error) {
        console.error('Error submitting to Are.na:', error);
        return resolve({
          statusCode: error.response?.status || 500, body: JSON.stringify({ message: "Failed to submit file to Are.na.", error: error.message, detail: error.response?.data })
        });
      }
    });
  });
};
