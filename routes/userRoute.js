import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {userHome,user_login} from "../controller/usercontroller.js";



const routes=express.Router();

const __dirname=path.dirname(fileURLToPath(import.meta.url))
const publicUserDirectoryPath = path.join(__dirname, "public");
routes.use(express.static(publicUserDirectoryPath));



routes.get('/',userHome)
routes.get('/login',user_login)
// routes.get('/signup',adminSignupPage)

// routes.post('/signin',adminLogin)
// routes.post('/signup',adminSignup)


export default routes;