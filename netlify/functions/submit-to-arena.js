const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    const { yourName, yourDescription, yourlink } = JSON.parse(event.body);

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

        const response = await axios.post(`https://api.are.na/v2/channels/vcu-senior-show-2024/blocks`, {
            source: yourLink,
            description: `${yourName}: ${yourDescription}`
        }, { headers });

        return { statusCode: 200, body: JSON.stringify({ message: 'Submission successful.' }) };
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
