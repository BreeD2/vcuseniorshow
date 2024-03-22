const axios = require('axios');

exports.handler = async (event) => {
    // Ensure the method is POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    try {
        const { imageUrl } = JSON.parse(event.body); // Parse the incoming request body
        const ARENA_CHANNEL_SLUG = 'testing-wrkgn_q6vbg'; // Your Are.na channel slug
        const ARENA_ACCESS_TOKEN = process.env.ARENA_ACCESS_TOKEN; // The Are.na access token from environment variables

        // Prepare the headers for the API request
        const headers = {
            'Authorization': `Bearer ${ARENA_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        };

        // Make the API request to Are.na
        await axios.post(`https://api.are.na/v2/channels/${ARENA_CHANNEL_SLUG}/blocks`, {
            source: imageUrl,
            description: 'User submitted image via Netlify function'
        }, { headers });

        // Return a success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Image submitted successfully to Are.na." })
        };
    } catch (error) {
        // Log detailed error for debugging
        console.error('Error submitting to Are.na:', error.message, error.response?.data);

        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to submit image to Are.na.",
                error: error.message,
                detail: error.response?.data
            })
        };
    }
};
