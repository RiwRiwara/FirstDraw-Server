const express = require("express")
const { create, getAllblogs, singleBlog , remove, update} = require("../controllers/blogController")
const router = express.Router()

router.post('/create', create)
router.get('/blogs', getAllblogs)
router.get('/blogs/:slug', singleBlog)
router.delete('/blogs/:slug', remove)
router.put('/blogs/:slug', update)

module.exports=router