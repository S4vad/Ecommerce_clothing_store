import express, { Router } from "express";
import { adminHome,adminLoginPage,adminLogin,adminSignup, adminSignupPage } from "../controller/admincontroller.js";



const routes=express.Router();

routes.use(express.static("public"))


routes.get('/',adminHome)
routes.get('/login',adminLoginPage)
routes.get('/signup',adminSignupPage)

routes.post('/signin',adminLogin)
routes.post('/signup',adminSignup)


export default routes;