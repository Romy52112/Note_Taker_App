const express = require('express');
const fs = require('fs');
const notes = require('./Develop/db/db.json');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { DH_CHECK_P_NOT_SAFE_PRIME } = require('constants');

const PORT = process.env.PORT || 3001;
const app = express();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//routes
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});
//post function to add new notes
app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./Develop/db/db.json"));
    const newNotes = req.body;
    newNotes.id = uuid.v4();
    notes.push(newNotes);
    fs.writeFileSync(path.join(__dirname, './Develop/db/db.json'), JSON.stringify(notes));
    res.json(notes);
});

//used for deleting notes
app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./Develop/db/db.json"));
    const deleteNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(deleteNote));
    res.json(deleteNote);
});

//Home Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

//notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

//listening to port
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} `);
});