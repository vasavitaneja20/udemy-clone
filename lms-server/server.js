import express from 'express'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
import dotenv from 'dotenv';
import { clerkWebhooks } from './controllers/webhooks.js';
dotenv.config();

//initialize express
const app = express()


//call connectDB function in mongodb.js to connect to database
await connectDB()

//add middleware
app.use(cors())


//add default route - home
app.get('/', (req, res)=>{   //req-request, res-response
res.send("API working")  //creates API endpoint
})

app.post('/clerk', express.json(), clerkWebhooks)



//port no
const PORT = process.env.PORT || 5000



app.listen(PORT, ()=>{

console.log(`server is running on PORT ${PORT}`)

})

