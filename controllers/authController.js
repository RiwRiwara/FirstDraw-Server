const User = require('../model/user')
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

//login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide an email and password' });
    }

    try {
        const user = await User.findOne({ email });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1d' });
        const isAdmin = user.role === 'Admin'; 
        res.status(200).json({ token, isAdmin , user}); 

    } catch (error) {
        res.status(500).json({ error: 'Failed to authenticate user' });
    }
};

//Sign up user
exports.signup = async (req, res) => {
    const { displayname, email, password, bio } = req.body;

    // Validate user input
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide an email and password' });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Email not valid!' });
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ error: 'Password not strong!' });
    }

    // Hash user's password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
        User.create({ displayname, email, password: hashedPassword, bio:bio })
            .then((users) => {
                const token = createToken(users._id)
                res.status(200).json({ email, token });
            })
            .catch((err) => {
                res.status(500).json({ error: "Email already used!" });
            });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};
