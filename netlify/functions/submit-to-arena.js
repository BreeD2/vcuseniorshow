const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { imageUrl, imageDescription } = JSON.parse(event.body);
    const token = process.env.ARENA_ACCESS_TOKEN;

    if (!token) {
        console.error('ARENA_ACCESS_TOKEN is not defined.');
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Missing Are.na access token." })
        };
    }

    // If you have a title field from your form, you can prepend it to the description.
    // Let's say you adjusted your form and JS to include `imageTitle`:
    // const { imageUrl, imageTitle, imageDescription } = JSON.parse(event.body);
    // Then construct your full description like so:
    const fullDescription = `Title: ${imageTitle}\n\nDescription: ${imageDescription}`;

    try {
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(`https://api.are.na/v2/channels/testing-wrkgn_q6vbg/blocks`, {
            content: imageUrl,
            description: fullDescription // Use the modified description with the title
        }, { headers });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Image submitted successfully." })
        };
    } catch (error) {
        console.error('Error submitting to Are.na:', error);
        return {
            statusCode: error.response.status,
            body: JSON.stringify({
                message: "Failed to submit image.",
                error: error.message,
                detail: error.response?.data
            })
        };
    }
};
