import express, { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import {userHome,signup,userSignup,login,userLogin,shop,logout,quickView,productDetails,cart,cartAdd,
        aboutPage,contactPage,addContact,wishlist,filter,categoryShop,search,cartDelete,cartSubTotalUpdate ,
        review,wishListDelete,addWishlist,checkPasswordStrength,loadMore} from "../controller/usercontroller.js";
import {order,orderGet,coupon,checkout,applyCoupon, verifyPayment,orderSuccess,orderCancel,orderCod} from "../controller/ordercontroller.js"
import { profile,profileAddress,addAddressPost,editAddress,profileDashboard,deleteAddress,profileOrder,userDetailsUpdate} from "../controller/profilecontroller.js";
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
routes.get('/categoryShop',userAuthentication,categoryShop)
routes.get('/order',userAuthentication,orderGet)
routes.get('/coupon',userAuthentication,coupon)
routes.get('/profile',userAuthentication,profile)
routes.get('/profileAddress',userAuthentication,profileAddress)
routes.get('/profileDashboard',userAuthentication,profileDashboard)
routes.get('/checkout',userAuthentication,checkout)
routes.get('/orderSuccess',userAuthentication,orderSuccess)
routes.get('/profileOrder',userAuthentication,profileOrder)
routes.get('/loadMore',userAuthentication,loadMore)




routes.delete('/cart/remove/:id',userAuthentication, cartDelete); // Temporarily without middleware
routes.delete('/removeWishList/:id',userAuthentication,wishListDelete)



routes.post('/signin',userSignup)
routes.post('/userlog',userLogin)
routes.post('/cart',userAuthentication,cartAdd)
routes.post('/contact',userAuthentication,addContact)
routes.post('/filter',userAuthentication,filter)
routes.post('/search',userAuthentication,search)
routes.post('/cart/update/:id',userAuthentication,cartSubTotalUpdate)
routes.post('/addAddress',userAuthentication,addAddressPost)
routes.post('/editAddress',userAuthentication,editAddress)
routes.post('/deleteAddress',deleteAddress)
routes.post('/review',userAuthentication,review)
routes.post('/addWishlist/:id',userAuthentication,addWishlist)
routes.post('/applyCoupon',userAuthentication,applyCoupon)
routes.post('/order',userAuthentication,order)
routes.post('/order/cod',userAuthentication,orderCod)
routes.post('/verifyPayment',userAuthentication,verifyPayment)
routes.post('/orderCancel',userAuthentication, orderCancel)
routes.post('/userDetailsUpdate',userAuthentication,userDetailsUpdate)
routes.post('/checkPasswordStrength',checkPasswordStrength)












export default routes;