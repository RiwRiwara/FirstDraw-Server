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
