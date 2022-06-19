const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "malay";

const fetchuser = require('../middlewares/fetchuser');

// Route-1: create new user using: register --- No login required
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
        const { name, email, password } = req.body

        // check the user is already exist or not
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ error: "Use already exists" });
        }

        // bcrypt password (hashing password)
        // genrate salt, (salt = password + some autogenarate text)
        const salt = await bcrypt.genSalt(10);
        const secretPass = await bcrypt.hash(password, salt);

        // create new user
        user = new User({
            name: name,
            email: email,
            password: secretPass
        });
        let result = await user.save();

        // create a jwt token for client
        const userData = {
            userId: user.id
        }
        const authToken = jwt.sign(userData, JWT_SECRET)

        // send a auth token to client
        res.json({ authToken: authToken });

    } catch (err) {
        // catch internal error
        console.log(err);
        res.status(500);
        res.send({ error: "Internal server error !!!" })
    }
})



// Route-2: authenticate user using: login --- No login required
router.post('/login', [

    // one array to define condition
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password should not be blank').isLength({ min: 1 })

], async (req, res) => {

    // If errors, then return bad request and errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // check user is exist or not
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credetials" });
        }

        // compare bcrypt password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credetials" });
        }

        // cretae a jwt token for client
        const userData = {
            userId: user.id
        }
        const authToken = jwt.sign(userData, JWT_SECRET);

        // send a auth token to client
        res.json({ authToken: authToken });


    } catch (err) {
        // catch internal error
        console.log(err);
        res.status(500);
        res.send({ error: "Internal server error !!!" })
    }
})


// Route-3: Get user details using: detuser --- Login required
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);

    } catch (err) {
        // catch internal error
        console.log(err);
        res.status(500);
        res.send({ error: "Internal server error !!!" })
    }
})




module.exports = router;