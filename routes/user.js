const express = require("express");
const { authenticate } = require("../middleware/authenticate");
const {
    getUser,
    getAllUser,
    editUser,
    deleteUser,
    getUserSummary
} = require("../controllers/userController");

const router = express.Router();

router.get("/users/summary",getUserSummary);
router.get("/users/",getAllUser);
// router.get("/users/",authenticate, getAllUser);
router.get("/user/", getUser);
router.put('/user/:emailSearch', editUser);
router.delete('/user/:id', deleteUser);

module.exports = router;
