const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { imageTitle, imageUrl, imageDescription } = JSON.parse(event.body);
    const token = process.env.ARENA_ACCESS_TOKEN;

    if (!token) {
        console.error('ARENA_ACCESS_TOKEN is not defined.');
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Missing Are.na access token." })
        };
    }

    try {
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Formatting the description to include both title and description.
        let fullDescription = `**${imageTitle}**\n${imageDescription}`;

        const response = await axios.post(`https://api.are.na/v2/channels/testing-wrkgn_q6vbg/blocks`, {
            source: imageUrl, // Correctly using the source parameter for the image URL.
            description: fullDescription, // The combined title and description.
        }, { headers });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Image submitted successfully." })
        };
    } catch (error) {
        console.error('Error submitting to Are.na:', error);
        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({
                message: "Failed to submit image.",
                error: error.message,
                detail: error.response?.data,
            })
        };
    }
};
