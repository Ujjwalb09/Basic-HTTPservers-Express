const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://ujjwalbhatt09:Bhatt_2021@cluster0.e1a378i.mongodb.net/"
  );
  
  const User = mongoose.model("Users", {
    name: String,
    username: String,
    pasword: String,
  });

const app = express();

app.use(express.json());


function userExists(username, password) {
  // write logic to return true or false if this user exists
  // in database

}

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = jwt.sign({ username: username }, jwtPassword);
  return res.json({
    token,
  });
});

app.get("/users", function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;

    // return a list of users other than this username

    
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

app.listen(3000)