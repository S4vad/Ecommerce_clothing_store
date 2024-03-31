import express from "express";
import {userHome,user_registration} from "../controller/usercontroller.js";



const routes=express.Router();

routes.use(express.static("public"))


routes.get('/',userHome)
routes.get('/user_registration',user_registration)
// routes.get('/login',adminLoginPage)
// routes.get('/signup',adminSignupPage)

// routes.post('/signin',adminLogin)
// routes.post('/signup',adminSignup)


export default routes;