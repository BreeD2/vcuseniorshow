const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  let yourName, yourDescription, yourlink; // Use `yourlink` to match the client-side submission

  try {
    const body = JSON.parse(event.body);
    yourName = body.yourName;
    yourDescription = body.yourDescription;
    yourlink = body.yourlink; // Correctly capture `yourlink` from the parsed body
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return { statusCode: 400, body: JSON.stringify({ message: 'Bad Request: Error parsing JSON.' }) };
  }

  const token = process.env.ARENA_ACCESS_TOKEN;
  if (!token) {
    console.error('ARENA_ACCESS_TOKEN is not defined.');
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error: Missing Are.na access token.' }) };
  }

  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.post(`https://api.are.na/v2/channels/vcu-senior-show-2024/blocks`, {
      source: yourlink, // Ensure this uses `yourlink`
      description: `${yourName}: ${yourDescription}`
    }, { headers });

    return { statusCode: 200, body: JSON.stringify({ message: 'Submission successful.' }) };
  } catch (error) {
    console.error('Error submitting to Are.na:', error);
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
