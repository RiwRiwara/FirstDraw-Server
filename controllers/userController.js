const User = require('../model/user')
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}


// Get all user
exports.getAllUser = (req, res) => {
    User.find({})
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "An error occurred while fetching all users." });
        });
};

//get user by Email
exports.getUserByEmail = (req, res) => {
    const { email } = req.params;

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                console.log(`User with email ${email} not found`);
                return res.status(404).json({ error: "User not found" });
            }

            res.json(user);
        })
        .catch((err) => {
            console.error(`Error fetching user with email ${email}:`, err);
            res.status(500).json({ error: "An error occurred while fetching the user." });
        });
};

//login user
exports.loginUser = async (req, res) => {
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
exports.signupUser = async (req, res) => {
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

// Edit user by email
exports.editUser = async (req, res) => {
    
    const {emailSearch} = req.params
    const { password, displayname, tier, role, bio, profile_img } = req.body;

    const updateFields = {};

    if (password) {
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: 'Password not strong!' });
        }
        // Hash user's password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updateFields.password = hashedPassword;
    }

    if (displayname) {
        updateFields.displayname = displayname;
    }
    if (profile_img) {
        updateFields.profile_img = profile_img;
    }

    if (tier) {
        updateFields.tier = tier;
    }

    if (role) {
        updateFields.role = role;
    }
    if (bio) {
        updateFields.bio = bio;
    }

    try {
        const user = await User.findOneAndUpdate({ email:emailSearch}, updateFields, { new: true });
        if (!user) {
            console.log(`User with emailSearch ${emailSearch} not found`);
            return res.status(404).json({ error: "User not found" });
        }
        const token = createToken(user._id);
        res.status(200).json({ email: user.email, token });

    } catch (error) {
        console.error(`Error updating user with email ${emailSearch}:`, error);
        res.status(500).json({ error: "An error occurred while updating the user." });
    }
    
};
