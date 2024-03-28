import express, { Router } from "express";
import {userHome} from "../controller/usercontroller.js";



const routes=express.Router();

routes.use(express.static("public"))


routes.get('/',userHome)
// routes.get('/login',adminLoginPage)
// routes.get('/signup',adminSignupPage)

// routes.post('/signin',adminLogin)
// routes.post('/signup',adminSignup)


export default routes;