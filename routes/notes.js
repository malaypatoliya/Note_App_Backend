const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middlewares/fetchuser');
const { body, validationResult } = require('express-validator');


// Route-1: Fetch all notes using: fetchallnotes --- Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.id });
        res.json(notes);
    } catch (err) {
        // catch internal error
        console.log(err);
        res.status(500);
        res.send({ error: "Internal server error !!!" })
    }
})



// Route-2: Add a new notes using: addnote --- Login required
router.post('/addnote', fetchuser, [

    // create one array to define condition
    body('title', 'Enter valid title').isLength({ min: 3 }),
    body('description', 'Enter description atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {

    // If errors, then return bad request
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    try {
        const {title, description} = req.body;

        // create a nre note object
        const note = new Note({
            user: req.id,
            title: title,
            description: description
        })
        const result = await note.save();
        res.send(result);

    } catch (err) {
        // catch internal error
        console.log(err);
        res.status(500);
        res.send({ error: "Internal server error !!!" })
    }
})


// Route-3: Update a existing note using: PUT : updatenote --- Login required
router.put("/updatenote/:id", fetchuser, async (req, res)=>{
    try {
        const {title, description} = req.body;

        // create a nre object
        const newNote = {};
        if(title){
            newNote.title = title;
        }
        if(description){
            newNote.description = description;
        }

        // Find the note to be updated
        let note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).send("Note not found !!!");
        }

        // check user which is owner of note
        if(note.user.toString() !== req.id){
            return res.status(401).send("Unothorised user, Not allow to update note !!!")
        }

        // update a note
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.send(note);

    } catch (err) {
         // catch internal error
         console.log(err);
         res.status(500);
         res.send({ error: "Internal server error !!!" })
    }
})


// Route-4: Delete note using: DELETE : deletenote --- Login required
router.put("/deletenote/:id", fetchuser, async (req, res)=>{
    try {
        // Find the note to be deleted
        let note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).send("Note not found !!!");
        }
        console.log( "Note user id is" + note.user.toString());
        console.log( "req user id is" + req.user.id);
        // check user which is owner of note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Unothorised user, Not allow to update note !!!")
        }

        // update a note
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.send(note);

    } catch (err) {
         // catch internal error
         console.log(err);
         res.status(500);
         res.send({ error: "Internal server error !!!" })
    }
})

module.exports = router;