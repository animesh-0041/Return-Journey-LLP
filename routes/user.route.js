const express=require("express")
const userRouter=express.Router()
const client = require('twilio')("AC625a81c562d2847a6e6aae961fe251ce", "51d2f16f9db2bbf97500e78c8244e3a0");
const prandom = require("prandom");
const bcrypt = require('bcrypt');
const { UserModel } = require("../model/user.model");
// const { otpGenerate } = require("../serviceFunction/otp.serviceFunction");


// userRouter.post("/generateOtp",async(req,res)=>{
//     try {
        
//     } catch (error) {
        
//     }
// })

















// const otp=otpGenerate()
userRouter.post('/genOtp',async(req,res)=>{
    const {number}=req.body
    try {
       





   const otp= prandom.number(6)
    client.messages.create({
     body: `Your Return Journey verification code is: ${otp}`,
     from: '+14789795217',
     to: '+919733614550'
   })
  .then(message =>{

    bcrypt.hash(otp, 5, async(err, hash)=> {
        if(err){

            res.send("Error")
        }
        else{
            const person= await UserModel.findOne({phoneNumber:"+919733614550"})
            if(person){
                await UserModel.findByIdAndUpdate({_id:person._id},{otp:hash})
                res.send("OTP send successful in your mobile number")
            }
            else{

                const user= new UserModel({phoneNumber:"+919733614550",otp:hash})
                await user.save()
                res.send("OTP send successful in your mobile number")
            }
        }
    });
  })
   
    } catch (error) {
        res.send(error)
    }
})



userRouter.post("/validate",async(req,res)=>{
    const {otp,phoneNumber}=req.body
    try {
        const user= await UserModel.findOne({phoneNumber})
        if(user){

            bcrypt.compare(otp, user.otp, async(err, result)=> {
                if(result){
                    res.send("OTP valid")
                }
                else{
                    res.send("OTP Notvalid")
                }
            });
        }
        else{
            res.send("User not found")
        }

        
    } catch (error) {
        
    }





})

userRouter.patch('/register',async(req,res)=>{
    const {phoneNumber,email,password}=req.body
    try {
        const user= await UserModel.findOne({phoneNumber})
        if(user){
            await UserModel.findByIdAndUpdate({_id:user._id},req.body)
            res.send("Registration Succesfull")
        }
        else{
            res.send("Somthing Error")
        }
        
    } catch (error) {
        res.send(error)
    }
})

module.exports={
    userRouter
}

