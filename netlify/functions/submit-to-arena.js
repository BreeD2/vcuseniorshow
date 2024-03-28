const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Parse the incoming event body to access imageUrl
    const { imageUrl } = JSON.parse(event.body);

    // Access the ARENA_ACCESS_TOKEN environment variable
    const token = process.env.ARENA_ACCESS_TOKEN;

    // Check if the token is available
    if (!token) {
        console.error('ARENA_ACCESS_TOKEN is not defined.');
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error: Missing Are.na access token." })
        };
    }

    try {
        // Your axios request using the token
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Example POST request to Are.na
        const response = await axios.post(`https://api.are.na/v2/channels/vcu-senior-show-2024/blocks`, {
            source: imageUrl, // Use the parsed imageUrl
            description: "User submitted image via Netlify function"
        }, { headers });

        // Successful response handling
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Image submitted successfully to Are.na." })
        };
    } catch (error) {
        // Error handling
        console.error('Error submitting to Are.na:', error);
        return {
            statusCode: error.response.status,
            body: JSON.stringify({
                message: "Failed to submit image to Are.na.",
                error: error.message,
                detail: error.response.data
            })
        };
    }
};
