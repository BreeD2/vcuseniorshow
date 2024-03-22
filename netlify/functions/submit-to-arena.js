const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Parse the incoming event body to access title, imageUrl, and description
    const { imageTitle, imageUrl, imageDescription } = JSON.parse(event.body);

    const token = process.env.ARENA_ACCESS_TOKEN;
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

        // Constructing the description to include both title and description if available
        let fullDescription = imageTitle ? `${imageTitle}\n\n${imageDescription}` : imageDescription;

        // Submit the POST request to Are.na
        const response = await axios.post(`https://api.are.na/v2/channels/testing-wrkgn_q6vbg/blocks`, {
            content: imageUrl,
            description: fullDescription // Combined title and description
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
                detail: error.response?.data
            })
        };
    }
};
