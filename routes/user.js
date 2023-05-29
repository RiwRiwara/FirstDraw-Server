const express = require("express");
const { authenticate } = require("../middleware/authenticate");
const {
    getUser,
    getAllUser,
    editUser
} = require("../controllers/userController");

const router = express.Router();

router.get("/users/",authenticate, getAllUser);
router.get("/user/", getUser);
router.put('/user/:emailSearch', editUser);

module.exports = router;
