const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');


// create new user using: register --- No login required
router.post('/register', [

    // one array to define condition
    body('name', 'Enter valid name').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })

], async (req, res) => {
    // If errors, then return bad request and errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        // check the user is already exist or not
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Use already exists" });
        }

        // create new user
        user = new User(req.body);
        let result = await user.save();
        res.json(result);

    } catch (err) {
        // catch internal error
        console.log(err);
        res.status(500);
        res.send({error: "Some error occured !!!"})
    }
})

module.exports = router;