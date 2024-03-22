const axios = require('axios');

exports.handler = async (event) => {
    // Handle preflight CORS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Adjust as needed for security
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: ""
        };
    }

    // Check for the presence of the ARENA_ACCESS_TOKEN environment variable
    if (!process.env.ARENA_ACCESS_TOKEN) {
        console.error('ARENA_ACCESS_TOKEN is not set.');
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error: Missing API token." })
        };
    }

    // Ensure the method is POST and the request body contains data
    if (event.httpMethod !== 'POST' || !event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Bad Request: POST method and request body are required." })
        };
    }

    try {
        const data = JSON.parse(event.body);
        if (!data.imageUrl) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Bad Request: imageUrl is required." })
            };
        }

        // Prepare the headers for the Are.na API request
        const headers = {
            'Authorization': `Bearer ${process.env.ARENA_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        };

        // Log the incoming request for debugging
        console.log('Submitting to Are.na:', event.body);

        // Make the API request to Are.na
        const response = await axios.post(`https://api.are.na/v2/channels/testing-wrkgn_q6vbg/blocks`, {
            source: data.imageUrl,
            description: 'User submitted image via Netlify function' // Customize this description
        }, { headers });

        // Return a success response
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*" // Ensure CORS policy allows your frontend to access this response
            },
            body: JSON.stringify({ message: "Image submitted successfully to Are.na." })
        };
    } catch (error) {
        // Detailed error logging
        console.error('Error submitting to Are.na:', error.response ? error.response.data : error.message);

        return {
            statusCode: error.response ? error.response.status : 500,
            body: JSON.stringify({
                message: "Failed to submit image to Are.na.",
                error: error.response ? error.response.data : error.message
            })
        };
    }
};
