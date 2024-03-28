const axios = require('axios');

exports.handler = async (event) => {
  // Ensure the request is a POST method
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  let yourName, yourDescription, link;

  // Safely parse the incoming JSON
  try {
    const body = JSON.parse(event.body);
    yourName = body.yourName;
    yourDescription = body.yourDescription;
    link = body.link;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return { statusCode: 400, body: JSON.stringify({ message: 'Bad Request: Error parsing JSON.' }) };
  }

  // Retrieve the ARENA_ACCESS_TOKEN from environment variables
  const token = process.env.ARENA_ACCESS_TOKEN;
  if (!token) {
    console.error('ARENA_ACCESS_TOKEN is not defined.');
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error: Missing Are.na access token.' }) };
  }

  // Set headers for the Are.na API request
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Post the submission to the specified Are.na channel
    const response = await axios.post(`https://api.are.na/v2/channels/vcu-senior-show-2024/blocks`, {
      source: link, // Assuming 'link' is the URL to be submitted
      description: `${yourName}: ${yourDescription}` // Concatenating name and description
    }, { headers });

    // Return a success response
    return { statusCode: 200, body: JSON.stringify({ message: 'Submission successful.', data: response.data }) };
  } catch (error) {
    console.error('Error submitting to Are.na:', error);
    // Return a detailed error response
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        message: 'Failed to submit.',
        error: error.message,
        detail: error.response?.data
      })
    };
  }
};
