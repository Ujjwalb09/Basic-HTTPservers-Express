//creating a basic http server using express

const express = require('express')
const app = express()
const port = 3000

// Middleware to parse JSON
app.use(express.json());

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
  
app.listen(port, ()=>{
  console.log(`Running on PORT ${port}`);
})