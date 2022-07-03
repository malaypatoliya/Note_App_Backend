const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middlewares/fetchuser');

// Route-1: Fetch all notes using: fetchallnotes --- Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.id });
        // send the all notes
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).send({ Error: "Internal server error !!!" })
    }
})

// Route-2: Add a new notes using: addnote --- Login required
router.post('/addnote', fetchuser, async (req, res) => {
    let success = false;
    const { title, description } = req.body;
    try {
        if (!title || !description) {
            return res.status(400).json({ success: success, Error: "Required all field" })
        } else {
            // create a new note object
            const note = new Note({
                user: req.id,
                title: title,
                description: description
            })
            const result = await note.save();
            // res.send(result);
            success = true;
            res.status(200).json({ success: success, Msg: "Note added successfully" });
        }
    } catch (err) {
        res.status(500).send({ Error: "Internal server error !!!" })
    }
})


// Route-3: Update a existing note using: PUT : updatenote --- Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    let success = false;
    const { title, description } = req.body;
    // Find the note to be updated
    let note = await Note.findById(req.params.id);

    try {
        if (!title || !description) {
            return res.status(400).json({ success: success, Error: "Required all field" })
        } else if (!note) {
            return res.status(400).send({ success: success, Error: "Note not found" });
        } else if (note.user.toString() !== req.id) {
            return res.status(400).send({ success: success, Error: "Unothorised user, Not allow to update note !!!" })
        } else {
            const newNote = {
                title: title,
                description: description
            }
            // update a note
            note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
            success = true;
            res.status(200).json({ success: success, Msg: "Note updated successfully" });
        }
    } catch (err) {
        res.status(500).send({ Error: "Internal server error !!!" })
    }
})


// Route-4: Delete note using: DELETE : deletenote --- Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    let success = false;
    try {
        // Find the note to be deleted
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(400).send({ success: success, Error: "Note not found" });
        } else if (note.user.toString() !== req.id) {
            return res.status(400).send({ success: success, Error: "Unothorised user, Not allow to delete note !!!" })
        } else {
            // delete a note
            note = await Note.findByIdAndDelete(req.params.id);
            success = true;
            res.status(200).json({ success: success, Msg: "Note deleted successfully" });
        }
    } catch (err) {
        res.status(500).send({ Error: "Internal server error !!!" })
    }
})

module.exports = router;