const express = require('express');
const router = express.Router();
const User = require('../models/User')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET_KEY;

const fetchuser = require('../middlewares/fetchuser');

// Route-1: create new user using: register --- No login required
router.post('/register', async (req, res) => {

    let success = false;
    const { name, email, password } = req.body;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    // check the user is already exist or not
    let user = await User.findOne({ email: email });

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: success, Error: "Required all field" })
        } else if (!regex.test(email)) {
            return res.status(400).json({ success: success, Error: "Email is not valid format" });
        } else if (user) {
            return res.status(400).json({ success: success, Error: "User already exists" });
        } else {
            // bcrypt password (hashing password)
            // genrate salt, (salt = password + some autogenarate text)
            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(password, salt);

            // create new user
            user = new User({
                name: name,
                email: email,
                password: hashPass
            });
            let result = await user.save();

            success = true;
            res.status(200).json({ success: success, Msg: "User created successfully" });
        }
    } catch (err) {
        res.status(500).send({ Error: "Internal server error !!!" })
    }
})



// Route-2: authenticate user using: login --- No login required
router.post('/login', async (req, res) => {
    let success = false;
    const { email, password } = req.body;

    // check user is exist or not
    let user = await User.findOne({ email: email });

    try {
        if (!email || !password) {
            return res.status(400).json({ success: success, Error: "Enter all field" })
        } else if (!user) {
            return res.json({ success: success, Error: "User doesn't exist" });
        } else {
            let passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.json({ success: success, Error: "Enter correct password" });
            } else {
                // cretae a jwt token for client
                const userData = {
                    userId: user.id
                }
                const authToken = jwt.sign(userData, JWT_SECRET);
                // send a auth token to client
                success = true;
                res.status(200).json({ success: success, authToken: authToken });
            }
        }
    } catch (err) {
        res.status(500).send({ Error: "Internal server error !!!" })
    }
})


// Route-3: Get user details using: detuser --- Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select('-password');
        if (user) {
            res.status(200).send(user);
        } else {
            res.json({ Error: "Not getting user" })
        }
    } catch (err) {
        res.status(500).send({ Error: "Internal server error !!!" })
    }
})




module.exports = router;