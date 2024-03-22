const axios = require('axios');

exports.handler = async (event) => {
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
        const response = await axios.post(`https://api.are.na/v2/channels/testing-wrkgn_q6vbg/blocks`, {
            source: "https://example.com/image.png",
            description: "Example image"
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
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to submit image to Are.na." })
        };
    }
};
