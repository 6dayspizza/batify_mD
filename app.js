/*
    SETUP
*/
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

// Require the 'fs' module to work with the file system
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views/public"));

const { engine } = require("express-handlebars");
var exphbs = require("express-handlebars");
const hbs = exphbs.create({
  partialsDir: "views/partials",
  extname: ".hbs",
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

const filePath = 'files/quotes.csv';

app.get('/', (req, res) => {
    res.send('Welcome to the microservice!');
});

app.get('/csv', (req, res) => {
    // Read the CSV file
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading CSV file:', err);
            return res.status(500).send('Internal Server Error');
        }
        
        // Parse the CSV data
        const rows = data.split('\n');
        const headers = rows[0].split(',');
        const rowCount = rows.length;
        
        // Randomly select a row (excluding the header row)
        const randomIndex = Math.floor(Math.random() * (rowCount - 1)) + 1;
        const selectedRow = rows[randomIndex];
        
        // Extract quote and author from the selected row
        const [id, quote, author, tags] = selectedRow.split(',');
        
        // Send only the quote and author as JSON
        res.json({ quote, author });
    });
});

app.listen(port, () => {
    console.log(`Microservice listening at http://localhost:${port}`);
});