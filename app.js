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

// Define the path to your CSV file
const filePath = 'files/quotes.csv';

// Endpoint to serve the CSV file
app.get('/csv', (req, res) => {
    // Read the CSV file
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading CSV file:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Send the CSV file as response
        res.header('Content-Type', 'text/csv');
        res.send(data);
    });
});

app.listen(port, () => {
    console.log(`Microservice listening at http://localhost:${port}`);
});