const express = require("express");
const { authenticate } = require("../middleware/authenticate");
const {
    getUser,
    getAllUser,
    loginUser,
    signupUser,
    editUser
} = require("../controllers/userController");

const router = express.Router();

router.get("/users/",authenticate, getAllUser);
router.get("/user/:email", getUser);
router.put('/user/:emailSearch', editUser);

module.exports = router;
