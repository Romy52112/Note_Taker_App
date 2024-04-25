const express = require('express');
const fs = require('fs');
const notes = require('./db/db.json');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { DH_CHECK_P_NOT_SAFE_PRIME } = require('constants');

const PORT = process.env.PORT || 3001;
const app = express();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

//routes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    res.json(notes);
});
//post function to add new notes
app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const newNotes = req.body;
    newNotes.id = uuidv4();
    notes.push(newNotes);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
    res.json(notes);
});

//used for deleting notes
app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const deleteNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(deleteNote));
    res.json(deleteNote);
});

//notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//Home Page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//listening to port
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} `);
});