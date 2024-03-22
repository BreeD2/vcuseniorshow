const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { imageUrl, imageTitle, imageDescription } = JSON.parse(event.body);
    const token = process.env.ARENA_ACCESS_TOKEN;

    if (!token) {
        console.error('ARENA_ACCESS_TOKEN is not defined.');
        return { statusCode: 500, body: JSON.stringify({ message: "Internal Server Error: Missing Are.na access token." }) };
    }

    try {
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Formatting the title and description in Markdown to include in the :content parameter
        const markdownContent = `# ${imageTitle}\n\n${imageDescription}`;

        const response = await axios.post(`https://api.are.na/v2/channels/${process.env.ARENA_CHANNEL_SLUG}/blocks`, {
            source: imageUrl, // for images, links, or embeds
            content: markdownContent // for the combined title and description
        }, { headers });

        return { statusCode: 200, body: JSON.stringify({ message: "Image submitted successfully to Are.na." }) };
    } catch (error) {
        console.error('Error submitting to Are.na:', error);
        return { statusCode: error.response.status, body: JSON.stringify({ message: "Failed to submit image to Are.na.", error: error.message, detail: error.response?.data }) };
    }
};
