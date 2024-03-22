const { imageUrl } = JSON.parse(event.body); // Extract imageUrl from the incoming request

// Use the extracted imageUrl in the API call
const response = await axios.post(`https://api.are.na/v2/channels/testing-wrkgn_q6vbg/blocks`, {
    source: imageUrl, // Use the dynamically provided imageUrl
    description: "User submitted image"
}, { headers });
