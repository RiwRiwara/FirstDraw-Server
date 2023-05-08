const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require("cors")
const mongoose = require("mongoose")
const http = require("http")
require("dotenv").config() 
// Routes
const blogRoute = require("./routes/blog");
const cardRoute = require("./routes/card");

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URL).then(() => {
    
    console.log("Mongodb connected");
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  }).catch((err) => {
    console.log({ err });
    process.exit(1);
  });


app.get('/', (req, res)=>{
    res.send("API RUNNING")
})
//route
app.use('/api', blogRoute)
app.use("/api", cardRoute);

module.exports = app