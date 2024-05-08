/*
    SETUP
*/

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

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

app.get('/', (req, res) => {
    res.send('Im telling you!');
});

app.listen(port, () => {
    console.log(`Microservice listening at http://localhost:${port}`);
});