const express = require("express");
const {
    login,
    signup,
    verifyToken,
    getUserByToken
} = require("../../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get('/profile', verifyToken, getUserByToken);

module.exports = router;
