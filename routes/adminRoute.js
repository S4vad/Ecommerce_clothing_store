import express, { Router } from "express";
import { adminHome,adminLoginPage,adminLogin,adminSignup, adminSignupPage,addProduct,productAdd ,product_list} from "../controller/admincontroller.js";



const routes=express.Router();

routes.use(express.static("public"))


routes.get('/',adminHome)
routes.get('/login',adminLoginPage)
routes.get('/signup',adminSignupPage)
routes.get('/addProduct',addProduct)
routes.get('/product_list',product_list)

routes.post('/signin',adminLogin)
routes.post('/signup',adminSignup)
routes.post('/addProduct',productAdd)


export default routes;