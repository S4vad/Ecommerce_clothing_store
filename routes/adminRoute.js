import express, { Router } from "express";
import { adminHome,adminLoginPage,adminLogin } from "../controller/admincontroller.js";



const routes=express.Router();

routes.use(express.static("public"))


routes.get('/',adminHome)
routes.get('/login',adminLoginPage)
routes.post('/signin',adminLogin)

export default routes;