//creating a basic http server using express

const express = require('express')
const app = express()
const zod = require("zod")
const port = 3000

// Middleware to parse JSON
app.use(express.json());

var users = [{
  name: "George",
  kidneys: [{
    healthy: false
  }]
}];

app.get("/getKidneyInfo", (request, response)=>{
      const georgeKidneys = users[0].kidneys;
      const noOfKidneys = georgeKidneys.length;

      const healthyKidneys = georgeKidneys.filter((kidneyOBJ) => kidneyOBJ.healthy === true)

      const numberOfHealthyKidneys = healthyKidneys.length;
      const numberOfUnhealthyKidneys = georgeKidneys.length - healthyKidneys.length;

      response.json({noOfKidneys, numberOfHealthyKidneys, numberOfUnhealthyKidneys});
})

app.post("/addNewKidney", (request, response)=>{
    const healthStatus = Boolean(request.body.healthStatus);

    users[0].kidneys.push({healthy: healthStatus});
    console.log(users[0].kidneys);

    response.send("kidney added successfully!!!!");
})

app.put("/replaceKidney", (request, response)=>{
     
  let check  = false;
  for(let i = 0; i < users[0].kidneys.length; i++){
         if(!users[0].kidneys[i].healthy){
         users[0].kidneys[i].healthy = true;
         check = true;
         }
     }
     if(!check){
      response.status(411).send("You have no unhealthy kidneys to replace");
     } else {
       response.send("kidney replaced successfully!!!!");
     }
})

app.delete("/deleteKidney", (request,reponse)=>{

   //return 411 if no unhealthy kidneys exist

   let check = false;
    for(let i = users[0].kidneys.length-1; i >= 0 ; i--){
      if(users[0].kidneys[i].healthy === false){
        check = true;
        users[0].kidneys.splice(i, 1);
      }
    }
    
    if(!check) {
      reponse.status(411).send("No unhealthy kidneys exist");
    } else {
      reponse.send("Unhealthy kidneys deleted successfully");
    }
    
})



//creating new route handler for GET requests
app.get('/route-handler', (req, res)=>{

    // res.json({
    //     name: "Ujjwal",
    //     age: 21
    // })

    //express will convert an object and Arrays to JSON object
    res.send([1, 2, 3, 4, 5]);
})
//route handler for GET requests
app.get('/calculateSum', (req, res) => {
  const n = parseInt(req.query.n);
  let ans = 0;

  for(let i = 0; i <= n; i++){
    ans += i;
  }

  res.send(ans.toString());
})
  
//route handler for POST request
app.post('/conversation', (req, res) => {
    // console.log(req.body);
  res.status(202).send('Hello World!')
})

//doing authentication and input validation using middlewares.
function authMiddleware(req, res, next){
  //middleware for username and password authentication
  const userName = req.headers.username;
  const password = req.headers.password;

  if(userName != "Ujjwal" || password != "pass"){
    res.status(404).json({msg: "Username or password is incorrect"});
    return;
  }

  next();
}

function inputValidationMiddleware(req, res, next){
  //middleware for input validation
  const kidneyId = req.query.kidneyId;

  if(kidneyId != 1 && kidneyId != 2){
    res.stats(404).json({msg: "wrong input"});
    return;
  }

  next();
}

let numberOfRequest = 0;

function calculateRequests(req, res, next){
  //middleware to calculate how many requests are hitting the server
    numberOfRequest++;
    console.log(numberOfRequest);
    next();
}

app.get("/healthCheckup",calculateRequests, authMiddleware, inputValidationMiddleware, (req, res)=>{

  res.json({msg: "your kidney is fine!"});

});


//global catches-> to catch exceptions from inside route handlers using error handling middleware.
app.use((err, req, res, next)=>{
  // console.log(err);
  res.json({msg: "Sorry somethins is up with server"})
})



//doing input validation using ZOD
const schema = zod.array(zod.number());

//{
// email: string => email
// password: atleast 8 letter
// country: "IN", "US"
//}

const schema2 = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
  country: zod.literal("IN").or(zod.literal("US"))
})

app.post("/health-checkup", (req, res)=>{
  const kidneys = req.body.kidneys;
  const response = schema.safeParse(kidneys);
  // const kidneyLength = kidneys.length;

  if(response.success === false){
    res.status(411).send("invalid input");
  }else{
  res.send(response);
  }
});

  
app.listen(port, ()=>{
  console.log(`Running on PORT ${port}`);
})