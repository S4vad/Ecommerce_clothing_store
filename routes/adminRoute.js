import express, { Router } from "express";
import { adminHome,adminLoginPage,adminLogin,adminSignup, adminSignupPage,
    addProduct,productAdd ,product_list,category_list,add_category} from "../controller/admincontroller.js";

// import upload from "../middlewares/arrayUploadMiddlware.js"
import { uploadImages,getResult,resizeImages } from "../middlewares/uploadResizeMiddeware.js";

const routes=express.Router();

routes.use(express.static("public"))


routes.get('/',adminHome)
routes.get('/login',adminLoginPage)
routes.get('/signup',adminSignupPage)
routes.get('/addProduct',addProduct)
routes.get('/product_list',product_list)
routes.get('/category_list',category_list)

routes.post('/signin',adminLogin)
routes.post('/signup',adminSignup)
routes.post('/addProduct',uploadImages,resizeImages,productAdd)
routes.post('/add_category',add_category)


export default routes;