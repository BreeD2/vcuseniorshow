const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { yourName, yourDescription, yourlink } = JSON.parse(event.body);

    const token = process.env.ARENA_ACCESS_TOKEN;
    if (!token) {
        console.error('ARENA_ACCESS_TOKEN is not defined.');
        return { statusCode: 500, body: 'Internal Server Error: Missing Are.na access token.' };
    }

    try {
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        const response = await axios.post(`https://api.are.na/v2/channels/testing-wrkgn_q6vbg/blocks`, {
            source: yourlink,
            description: `${yourName}: ${yourDescription}`
        }, { headers });

        return { statusCode: 200, body: JSON.stringify({ message: "Image submitted successfully to Are.na." }) };
    } catch (error) {
        console.error('Error submitting to Are.na:', error);
        return { statusCode: error.response?.status || 500, body: JSON.stringify({ message: "Failed to submit image to Are.na.", error: error.message, detail: error.response?.data }) };
    }
};
