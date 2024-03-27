const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let params;
  try {
    params = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Bad Request: Invalid JSON' };
  }

  const { imageTitle, imageUrl, imageDescription } = params;
  const token = process.env.ARENA_ACCESS_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Missing Are.na access token." })
    };
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const fullDescription = `**${imageTitle}**\n${imageDescription}`;

  try {
    const response = await axios.post(
      `https://api.are.na/v2/channels/vcu-senior-show-2024/blocks`,
      { source: imageUrl, description: fullDescription },
      { headers }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Image submitted successfully.", data: response.data })
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        message: "Failed to submit image.",
        error: error.message,
        detail: error.response?.data
      })
    };
  }
};
