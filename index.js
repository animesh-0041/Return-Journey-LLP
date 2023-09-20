const express= require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.route");
const app = express()
require('dotenv').config();


app.use(express.json())

app.use('/user',userRouter)

app.listen(8080,async()=>{
    try {
        await connection
        console.log("connected to DB");
        
    } catch (error) {
        console.log(error);

    }
    console.log("Runing at 8080");
})