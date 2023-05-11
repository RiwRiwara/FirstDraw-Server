// Call Database
const slugify = require("slugify");
const Blogs = require("../model/blogs")
const {v4:uuidv4} = require('uuid');
//create data
exports.create = (req, res) => {
    const {title, content, author} = req.body;
    slug = slugify(title);

    //Validate
    if(!slug)slug=uuidv4();
    switch(true){
        case !title:
            return res.status(400).json({error:"Title require"})
        case !content:
            return res.status(400).json({error:"Content require"})

    }

    //Save data
    Blogs.create({title, content, author, slug})
    .then((blog) => {
      res.json(blog);
    })
    .catch((err) => {
      res.status(400).json({error:"Duplicate Title"})
    });

}

//Get data
exports.getAllblogs = async (req, res) => {
  Blogs.find({})
    .then((blogs) => {
      res.json(blogs);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

//pull from slug
exports.singleBlog = async (req, res) => {
  const { slug } = req.params;
  try {
    const blog = await Blogs.findOne({ slug }).exec();
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching the blog." });
  }
};


exports.remove=(req, res) => {
  const {slug} = req.params
  try{
    Blogs.findOneAndRemove({slug}).exec();
    res.json({
      message : "Blog has been deleted."
    })
  }catch (err){
    console.log(err)
  }

}

exports.update=(req, res) => {
  const {slug} = req.params
  // Send data => title content, author
  const {title, content, author} = req.body
  Blogs.findOneAndUpdate({slug}, {title, content, author}, {new:true}).exec().then((blog) => {
    res.json(blog);
  }).catch((err) => {
    console.log(err)
  });
}