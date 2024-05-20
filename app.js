/*
    IMPORTS
*/
const express = require('express');
const { engine } = require("express-handlebars");
const axios = require('axios');
const exphbs = require("express-handlebars");
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const corsOptions = {
    /*origin: 'http://localhost:3003/',*/
    origin: 'https://stormy-falls-91485-113c8c95f4d5.herokuapp.com/',
    optionsSuccessStatus: 200,
};

/*
    SETUP
*/
const app = express();
const port = process.env.PORT || 3004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views/public"));
app.use(cors(corsOptions));

const hbs = exphbs.create({
  partialsDir: "views/partials",
  extname: ".hbs",
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

const filePathBats = 'files/batsoverview.csv';
const filePathVolunteers = 'files/volunteers.csv';

const readCSVFileBats = (filePathBats) => {
    return new Promise((resolve, reject) => {
        const lines = [];
        fs.createReadStream(filePathBats)
            .pipe(csv())
            .on('data', (data) => lines.push(data))
            .on('end', () => resolve(lines))
            .on('error', (error) => reject(error));
    });
};

const readCSVFileVolunteers = (filePathVolunteers) => {
    return new Promise((resolve, reject) => {
        const lines = [];
        fs.createReadStream(filePathVolunteers)
            .pipe(csv())
            .on('data', (data) => lines.push(data))
            .on('end', () => resolve(lines))
            .on('error', (error) => reject(error));
    });
};

app.get('/', (req, res) => {
    res.send('hi microserviceD');
});

app.post('/species', async (req, res) => {
    const { species } = req.body;
    console.log('Received data:', species);
    
    try {
        const lines = await readCSVFileBats(filePathBats);
        const result = lines.find(line => line.Species === species);
        
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('Species not found');
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal Server Error');
    }
});

const getVolunteerWithLowestBats = async () => {
    try {
        const volunteers = await readCSVFileVolunteers(filePathVolunteers);
        
        // Find the volunteer with the lowest number of assigned bats
        let minAssignedBats = Number.MAX_SAFE_INTEGER;
        let selectedVolunteer = null;

        volunteers.forEach(volunteer => {
            const assignedBats = parseInt(volunteer['assignedbats']);
            if (assignedBats < minAssignedBats) {
                minAssignedBats = assignedBats;
                selectedVolunteer = volunteer;
            } else if (assignedBats === minAssignedBats) {
                // Randomly select one of the volunteers with the lowest number of assigned bats
                if (Math.random() < 0.5) {
                    selectedVolunteer = volunteer;
                }
            }
        });

        return selectedVolunteer;
    } catch (error) {
        console.error('Error reading CSV file:', error);
        throw error;
    }
};

app.get('/volunteers', async (req, res) => {
    try {
        const volunteer = await getVolunteerWithLowestBats();
        res.json(volunteer);
    } catch (error) {
        console.error('Error reading CSV file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/batsoverview', async (req, res) => {
    try {
        const lines = await readCSVFileBats(filePathBats);
        res.json(lines);
    } catch (error) {
        console.error('Error reading CSV file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Microservice listening at http://localhost:${port}`);
});
