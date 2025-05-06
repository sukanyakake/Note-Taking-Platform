import express from "express"
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import middleware from "../middleware/middleware.js";
import dotenv from "dotenv";

const router=express.Router();

router.post('/register',async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const user=await User.findOne({email});
        if(user){
            return res.status(401).json({success:false,message:"User already exits"});
        }
        const hpass=await bcrypt.hash(password,10);
        const newUser=new User({
            name,email,password:hpass
    })
    await newUser.save();
    res.status(200).json({ success: true, message: "Account created successfully" });
}
        catch (error) {
            return res.status(500).json({success:false,message:"error"});

          }
          
    
})
router.post('/login',async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({success:false,message:"User not exists "});
        }
        const checkpass=await bcrypt.compare(password,user.password);
        if(!checkpass){
            return res.status(401).json({success:false,message:"wrong credentials"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"5h"});
        res.status(200).json({ success: true,token,user:{name:user.name} ,message: "Login successfull" });
}
        catch (error) {
            return res.status(500).json({success:false,message:"error in login "});

          }
          
    
})

router.get("/verify",middleware,async(req,res)=>{

    return res.status(200).json({success:true,user:req.user});
})
export default router;