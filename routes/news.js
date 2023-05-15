const express = require("express")
const { create, getAllNews, singleNews , remove, update} = require("../controllers/newsController")
const router = express.Router()

router.post('/create', create)
router.get('/blogs', getAllNews)
router.get('/blogs/:slug', singleNews)
router.delete('/blogs/:slug', remove)
router.put('/blogs/:slug', update)

module.exports=router