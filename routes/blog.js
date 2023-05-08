const express = require("express")
const { create, getAllblogs, singleBlog } = require("../controllers/blogController")
const router = express.Router()


router.post('/create', create)
router.get('/blogs', getAllblogs)
router.get('/blogs/:slug', singleBlog)

module.exports=router