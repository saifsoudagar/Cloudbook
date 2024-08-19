const express = require("express");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const jwt_secret = 'helloimsaif@goodboy';

router.post(
    '/createuser', [
        body("name", 'enter a valid name ').isLength({ min: 3 }),
        body("email", 'enter a valid email').isEmail(),
        body("password", 'wrong password').isLength({ min: 8 }),
    ],
    async(req, res) => {
        let success=false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let newUser = await User.findOne({ email: req.body.email });
            if (newUser) {
                return res.status(400).json({success, error: "A user with this email already exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            newUser = await User.create({
                name: req.body.name,
                password: hashedPassword,
                email: req.body.email,
            });

            const data = {
                id: newUser.id
            };
            const authToken = jwt.sign(data, jwt_secret);
            res.json({ success: true, authToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.post(
    '/login', [
        body("email", 'enter a valid email').isEmail(),
        body("password", 'password is required').exists(),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            const data = { id: user.id };
            const authToken = jwt.sign(data, jwt_secret);
            res.json({ success: true, authToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.post(
    '/getuser', fetchuser,
    async(req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

module.exports = router;