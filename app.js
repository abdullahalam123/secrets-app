require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB"); //connect db

const userSchema = new mongoose.Schema({ //create a schema
  email : String,
  password : String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema); //create a doucment

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  //create a new user when the user sends their name and password from "register route"
  const newUser = new User({
    email : req.body.username,
    password : req.body.password
  });

  newUser.save(function(err){
    if(!err) res.render("secrets");
    else console.log("there was an error");
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  //find user with that particulr username
  User.findOne({email : username}, function(err, foundUser){
    if(err) console.log(err);
    else {
      if(foundUser) //if the user is found
      {
        if(foundUser.password === password) //found user pass matches entered password
        {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, function(){
  console.log("server started successfully");
});
