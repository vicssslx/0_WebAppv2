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

        // Check if the response is successful
        if (response.ok) {
            const data = await response.text(); // Use text() to get HTML content
            const responseContainer = document.getElementById('responseContainer');
            responseContainer.innerHTML = data; // Insert HTML content into the DOM
        } else {
            console.log('Error in server response:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('responseContainer').innerText = 'Internal Server Error';
    }
});

function formatRecommendations(recommendation) {
    const lines = recommendation.split('\n');
    const books = lines.slice(1); // Exclude the first line (introductory message)
    const formattedList = books.map((book) => {
        return '<div>' + book + '</div>';
    });

    // Join the list and add HTML tags
    return '<p>Based on the genres you mentioned and the author you like, here are some book recommendations for you:</p>' + formattedList.join('');
}