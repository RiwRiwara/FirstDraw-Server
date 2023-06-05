const User = require('../model/user')
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' })
}


exports.getAllUser = (req, res) => {
    const query = {};
    const sortPriority = { 'Dragon': 1, 'Blue': 2, 'Sillver': 3 }; // Add more if necessary

    if (req.query.displayname) {
        query.displayname = { $regex: new RegExp(req.query.displayname, "i") };
    }
    
    User.find(query)
        .then((users) => {
            users.sort((a, b) => {
                const aPriority = sortPriority[a.tier] || Infinity;
                const bPriority = sortPriority[b.tier] || Infinity;
                return aPriority - bPriority;
            });
            res.json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "An error occurred while fetching all users." });
        });
};



//get user by Email and id
exports.getUser = (req, res) => {
    const { id } = req.query;
    User.findOne({ _id: id })
        .then((user) => {
            if (!user) {
                console.log(`User with id ${id} not found`);
                return res.status(404).json({ error: "User not found" });
            }

            res.json(user);
        })
        .catch((err) => {
            console.error(`Error fetching user with id ${id}:`, err);
            res.status(500).json({ error: "An error occurred while fetching the user." });
        });
};




// Edit user by email
exports.editUser = async (req, res) => {

    const { emailSearch } = req.params

    const updateFields = {};

    if ( req.body.password) {
        if (!validator.isStrongPassword( req.body.password)) {
            return res.status(400).json({ error: 'Password not strong!' });
        }
        // Hash user's password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash( req.body.password, saltRounds);
        updateFields.password = hashedPassword;
    }

    if ( req.body.displayname) {
        updateFields.displayname =  req.body.displayname;
    }
    if ( req.body.profile_img) {
        updateFields.profile_img =  req.body.profile_img;
    }

    if ( req.body.tier) {
        updateFields.tier =  req.body.tier;
    }

    if ( req.body.role) {
        updateFields.role =  req.body.role;
    }
    if ( req.body.bio) {
        updateFields.bio =  req.body.bio;
    }
    if ( req.body.email) {
        updateFields.email =  req.body.email;
    }

    try {
        const user = await User.findOneAndUpdate({ email: emailSearch }, updateFields, { new: true });
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

exports.deleteUser = (req, res) => {
    const { id } = req.params;

    User.findByIdAndDelete(id)
        .then((user) => {
            if (!user) {
                console.log(`User with id ${id} not found`);
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ message: `User with id ${id} has been deleted successfully.` });
        })
        .catch((err) => {
            console.error(`Error deleting user with id ${id}:`, err);
            res.status(500).json({ error: "An error occurred while deleting the user." });
        });
};
