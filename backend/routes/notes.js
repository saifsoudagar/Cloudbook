const express = require('express');
const Notes = require("../models/Notes");
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Route 1: Fetch all notes for the authenticated user
router.get('/fetchallnotes', fetchuser, async(req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Route 2: Add a new note for the authenticated user

router.post('/addnotes', fetchuser, [
    body("title").isLength({ min: 2 }).withMessage('Enter a valid title'),
    body("description").isLength({ min: 5 }).withMessage('Enter a valid description')
], async(req, res) => {
    try {
        const { title, description, tag } = req.body;

        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create a new note
        const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        });

        // Save the note to the database
        const savedNote = await note.save();

        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});




// Route 3: updating already existing note using PUT request
router.put('/updatenote/:id', fetchuser, async(req, res) => {

    try {
        const { title, description, tag } = req.body;

        ////creating newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };



        /// finding the note and updating it**

        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send('not found');
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('not allowed');
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note)


    } catch (error) {

    }

});
// Route 4: deleting already existing note using delete request
router.delete('/deletenote/:id', fetchuser, async(req, res) => {

    try {
        const { title, description, tag } = req.body

        /// finding the note and deleting it**

        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send('not found');
        }
        ////allowing deletion only if user own the note**

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('not allowed');
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json("successfully deleted the note")


    } catch (error) {

    }

});

module.exports = router;