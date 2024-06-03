import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {userHome,signup,userSignup,login,userLogin} from "../controller/usercontroller.js";



const routes=express.Router();

const __dirname=path.dirname(fileURLToPath(import.meta.url))
const publicUserDirectoryPath = path.join(__dirname, "public");
routes.use(express.static(publicUserDirectoryPath));



routes.get('/',userHome)
routes.get('/signup',signup)
routes.get('/login',login)
// routes.get('/signup',adminSignupPage)

routes.post('/signin',userSignup)
routes.post('/userlog',userLogin)



export default routes;