import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createReadStream } from 'fs';
import { OpenAI } from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

const openaiInstance = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/recommendations', async (req, res) => {
    const { genres, authors } = req.body;

    try {
        const response = await openaiInstance.chat.completions.create({
            model: "gpt-3.5-turbo",
            max_tokens: 300,
            messages: [{ role: "user", content: `recommend three books for someone who loves the following genres: "${genres}" and the following authors: "${authors}" with a one-line summary for each book` }]
        });

        console.log('OpenAI Response:', response); // Log the entire OpenAI response
        // console.log('OpenAI Response:', response.data?.choices;); 
        const choices = response.choices;
        console.log(choices);

        if (choices && choices.length > 0) {
            const data = choices[0]?.message?.content;
            console.log(data);
            if (data) {
                // Split the recommendations into an array of lines
                const recommendationsList = formatRecommendations(data); //.split('\n').map((book, index) => `${index + 1}. ${book}`).join('\n');
                res.send(recommendationsList);
            } else {
                console.log('No recommendation content in response. Returning error message.');
                res.status(500).send('No response content, please try again...');
            }
        } else {
            console.log('No choices in response. Returning error message.');
            res.status(500).send('No choices in response, please try again...');
        }

        const error = response.data?.error;
        if (error) {
            console.error('OpenAI Error:', error);
            res.status(500).send('OpenAI Error');
            return;
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// function formatRecommendations(recommendation) {
//     const lines = recommendation.split('\n');
//     const books = lines; //.slice(1); // Exclude the first line (introductory message)
//     const formattedList = books.map((book, index) => {
//         return (index + 1) + '. ' + book;
//     });

//     // Join the list and add HTML tags
//     return '<p>Based on the genres you mentioned and the author you like, here are some book recommendations for you:</p><ol>' + formattedList.join('') + '</ol>';
// };

function formatRecommendations(recommendation) {
    const lines = recommendation.split('\n');
    const books = lines; //.slice(1); // Exclude the first line (introductory message)
    const formattedList = books.map((book) => {
        return '<div>' + book + '</div><br/>';
    });
    // Join the list and add HTML tags
    return '<p>Based on the genres you mentioned and the author you like, here are some book recommendations for you:</p><ol>' + formattedList.join('') + '</ol>';
}; 

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
