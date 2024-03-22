const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Parse the incoming event body
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

        const response = await axios.post(`https://api.are.na/v2/channels/testing-wrkgn_q6vbg/blocks`, {
            title: imageTitle, // Use the parsed imageTitle
            content: imageUrl, // Are.na API might use "content" for the image URL
            description: imageDescription // Use the parsed imageDescription
        }, { headers });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Image submitted successfully." })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: error.response.status,
            body: JSON.stringify({
                message: "Failed to submit.",
                error: error.message,
                detail: error.response?.data
            })
        };
    }
};
