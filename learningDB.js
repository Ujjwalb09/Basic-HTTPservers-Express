const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://ujjwalbhatt09:Bhatt_2021@cluster0.e1a378i.mongodb.net/user_app"
  );
  
  const User = mongoose.model("users", {
    name: String,
    email: String,
    password: String,
  });

const app = express();

app.use(express.json());


async function userExists(email,password) {
  // write logic to return true or false if this user exists
  // in database

  const userExist = await User.exists({email: email});

  console.log(userExist);

  return userExist;

}

app.post("/signUp", async (req, res)=>{
 const email = req.headers.email;
 const password = req.headers.password;
 const name = req.headers.name;

 const userExist = await userExists(email);

 if(userExist){
  return res.status(400).send("User already exist!");
 }

 var token = jwt.sign({email: email}, jwtPassword);

 const user = new User({
  name: name,
  email: email,
  password: password
 })

 user.save();

 res.json({
  msg: "User created successfully",
  token: token
 })

})

app.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const userExist = await userExists(email, password);

  if(!userExist){
    return res.status(403).json({
      msg: "User does not exist!"
    })
  }

  var token = jwt.sign({ email: email }, jwtPassword);

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