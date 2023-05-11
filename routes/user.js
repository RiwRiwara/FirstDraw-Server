const express = require("express");
const {
    getUserByEmail,
    getAllUser,
    loginUser,
    signupUser,
    editUser
} = require("../controllers/userController");

const router = express.Router();


router.get("/user", getAllUser);
router.get("/user/:email", getUserByEmail);
router.post("/user/login", loginUser);
router.post("/user/signup", signupUser);
router.put('/user/:emailSearch', editUser);

module.exports = router;
