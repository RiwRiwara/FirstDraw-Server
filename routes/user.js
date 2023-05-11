const express = require("express");
const {
    getUserById,
    getAllUser,
    loginUser,
    signupUser,
    editUser
} = require("../controllers/userController");

const router = express.Router();


router.get("/user", getAllUser);
router.get("/user/:id", getUserById);
router.post("/user/login", loginUser);
router.post("/user/signup", signupUser);
router.put('/user/:email', editUser);

module.exports = router;
