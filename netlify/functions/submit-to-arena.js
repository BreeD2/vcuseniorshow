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

        // Including the title within the description field
        let combinedDescription = imageTitle ? `${imageTitle}\n\n${imageDescription}` : imageDescription;

        const response = await axios.post(`https://api.are.na/v2/channels/testing-wrkgn_q6vbg/blocks`, {
            content: imageUrl,
            description: combinedDescription
        }, { headers });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Image submitted successfully to Are.na." })
        };
    } catch (error) {
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
