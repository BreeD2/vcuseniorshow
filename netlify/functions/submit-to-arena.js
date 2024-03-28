const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    const { yourName, yourDescription, yourLink } = JSON.parse(event.body);

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

        // Formatting the description to have the name and description on separate lines using markdown for better readability.
        const formattedDescription = `**Name:** ${yourName}\n\n**Description:** ${yourDescription}`;

        const response = await axios.post(`https://api.are.na/v2/channels/vcu-senior-show-2024/blocks`, {
            source: yourLink,
            description: formattedDescription // Using the formatted description
        }, { headers });

        return { statusCode: 200, body: JSON.stringify({ message: 'Submission successful.', response: response.data }) };
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
