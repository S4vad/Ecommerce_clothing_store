
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usermodel from "../models/userSchema.js";
import { name } from "ejs";

export async function userHome(req,res){
    try {
    res.render('user/index')
        
    } catch (error) {
        res.render(error)
        
    }
}


export async function signup(req,res){
    try {
    res.render('user/userSignup')
        
    } catch (error) {
        
    }
}

export async function userSignup(req,res){
    // console.log(req.body)
    const {email,password}=req.body;
    try {
        const hashedpassword=await bcrypt.hash(password,10);
        await usermodel.create({email:email,password:hashedpassword})
        res.redirect('/')

        
    } catch (error) {
        console.log(error.message)
        res.send("<script>alert('product not created successfully')</script>");
        
    }
} 

export async function login(req,res){
    res.render('user/userLogin',{message:""})
}

export async function userLogin(req,res){
    const {email,password}=req.body;
    try {
        const user = await usermodel.findOne({email});
        
        if (!user) {
            return res.render('user/userLogin',{message:"Email is not registered"});
        }
        
        const isPasswordCorrect =await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.render('user/userLogin',{message:"Incorrect password"});
        }

        const token = jwt.sign({userId: user._id},"jwtid",{expiresIn:"5d"});
        res.cookie("jwt", token, { httpOnly: true });
       
        return res.redirect('/');
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
}


