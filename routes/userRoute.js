import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {userHome,signup,userSignup,login,userLogin,shop,logout,quickView,productDetails,cart,cartAdd,aboutPage,contactPage,addContact,wishlist,wishlistAdd} from "../controller/usercontroller.js";
import { userAuthentication } from "../middlewares/userauthentication.js";



const routes=express.Router();

const __dirname=path.dirname(fileURLToPath(import.meta.url))
const publicUserDirectoryPath = path.join(__dirname, "public");
routes.use(express.static(publicUserDirectoryPath));



routes.get('/',userAuthentication,userHome)

routes.get('/signup',signup)
routes.get('/login',login)
routes.get('/shop',userAuthentication,shop)//req,res,next we get both controller and middleware
routes.get('/quickView/:id',userAuthentication,quickView)
routes.get('/logout',logout)
routes.get('/productDetails/:id',userAuthentication,productDetails)
routes.get('/cart',userAuthentication,cart)
routes.get('/wishlist',userAuthentication,wishlist)
routes.get('/about',userAuthentication,aboutPage)
routes.get('/contact',userAuthentication,contactPage)

routes.post('/signin',userSignup)
routes.post('/userlog',userLogin)
routes.post('/cart',userAuthentication,cartAdd)
routes.post('/cart',userAuthentication,wishlistAdd)
routes.post('/contact',userAuthentication,addContact)






export default routes;