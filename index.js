
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const myRouter = require("./router/index");
const cookieParser = require('cookie-parser');
var flash = require('connect-flash');
const fs = require('fs');
var path = require('path')
var rfs = require('rotating-file-stream') // version 2.x
const { format } = require('date-fns');

dotenv.config();    
//connect database
mongoose.connect((process.env.MONGODB_URL),()=>{
    console.log("connected database");
});



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(express.urlencoded({ extended: true }));
 app.use(express.json());


app.use(bodyParser.json());

app.use(cookieParser());


app.use(bodyParser.urlencoded({ extended: true }))
//Static files
app.use(express.static(__dirname + '/public'));

// cau hinh engine ejs
app.set("view engine", "ejs");
app.set("views","./view");

app.use('/static', express.static('public'))

app.use(cors());



function logFilename(time) {
    if (!time) return 'access.log';
    return `${format(time, 'yyyy-MM-dd')}-access.log`;
  }

// create a rotating write stream
var accessLogStream = rfs.createStream(logFilename(new Date()), {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logging/logger')
})


// setup the logger
app.use(morgan('common', { stream: accessLogStream }))


// API
app.use("/api", myRouter);   

        
app.listen(8000, ()=>{
    console.log("Server is running..");
})