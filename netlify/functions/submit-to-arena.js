const axios = require('axios');

exports.handler = async (event) => {
    // Your function logic...
    const token = process.env.ARENA_ACCESS_TOKEN; // Ensure you've set this in your Netlify environment variables
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Replace YOUR_CHANNEL_SLUG with "testing-wrkgn_q6vbg"
    const response = await axios.post(`https://api.are.na/v2/channels/testing-wrkgn_q6vbg/blocks`, {
        source: event.body.imageUrl, // Assuming the body contains an imageUrl property
        description: 'User submitted image via Netlify function' // You can customize this description
    }, { headers });

    // Handle the response...
    if (response.status === 200) { // Check if the request was successful
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Image submitted successfully to Are.na." })
        };
    } else {
        // Log error or handle unsuccessful request
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to submit image to Are.na." })
        };
    }
};
