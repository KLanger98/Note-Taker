const express = require('express');

const api = require('./public/routes/api')

const PORT = process.env.PORT || 3001;
const path = require('path');

const app = express();
const { get } = require('https');

//Middleware
app.use(express.static('public'));
app.use(express.json());

//redirect api requests to the api.js
app.use('/api/notes', api);

//return index.html at '/' route
app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

//load notes.html at /notes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

//Wildcard path
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

//listen
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);