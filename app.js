require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB"); //connect db

const userSchema = new mongoose.Schema({ //create a schema
  email : String,
  password : String
});

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
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    //create a new user when the user sends their name and password from "register route"
    const newUser = new User({
      email : req.body.username,
      password : hash //hash the user pass
    });

    newUser.save(function(err){
      if(!err) res.render("secrets");
      else console.log("there was an error");
    });
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
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result === true)
          {
            res.render("secrets");
          }
        });
      }
    }
  });
});

app.listen(3000, function(){
  console.log("server started successfully");
});
