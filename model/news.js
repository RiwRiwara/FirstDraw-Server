// Title  Content  slug(url)

const mongoose = require("mongoose")

const newsSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    content :{
        type:{},
        require:true
    },
    author:{
        type:String,
        require:false
    },
    slug:{
        type:String,
        lowercase:true,
        unique:true
    }
}, {timestamps:true})

module.exports = mongoose.model("News", newsSchema)