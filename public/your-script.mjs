document.getElementById('recommendationsForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const genres = document.getElementById('genres').value;
    const authors = document.getElementById('authors').value;
    try {
        const response = await fetch('/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                genres: genres,
                authors: authors,
            }),
        });

        const data = await response.json();
        console.log('Response data:', data);
        const responseContainer = document.getElementById('responseContainer');
        if (data && data.recommendation) {
            const recommendationsList = formatRecommendations(data.recommendation);
            responseContainer.innerHTML = recommendationsList;
        } else {
            console.log('No recommendation in response. Returning error message.');
            responseContainer.innerText = 'No response, please try again...';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('responseContainer').innerText = 'Internal Server Error';
    }
});

// Function to format recommendations as an ordered list
function formatRecommendations(recommendation) {
    const lines = recommendation.split('\n');
    const books = lines.slice(1); // Exclude the first line (introductory message)
    const formattedList = books.map((book, index) => {
        return (index + 1) + '. ' + book;
    });            
    return '<p>Based on the genres you mentioned and the author you like, here are some book recommendations for you:' +
    '</p><ol><li>' + formattedList.join('</li><li>') + '</li></ol>';
}

// ... Your existing Express setup

app.use(express.static('public')); 

// Serve the HTML file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Your other routes

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});