import express, { Router } from "express";
import { adminAuthentication } from "../middlewares/adminAuthentication.js";
import { adminHome,adminLoginPage,adminLogin,adminSignup, adminSignupPage,
    addProduct,productAdd ,product_list,category_list,add_category,edit_product,
    delete_product,users,user_details,edit_single_product,delete_category,edit_category,
    addBanner,banner,bannerList,editBanner,deleteBanner,addSubBanner,subBanner,subBannerList,
    deleteSubBanner,editSubBanner,coupon,addCoupon,updateCouponStatus,
    couponList,editCoupon,deleteCoupon,editCouponPost,customersList,editIsActive,reviewList,orderList,logout} from "../controller/admincontroller.js";
import {changeStatus} from "../controller/ordercontroller.js"

import { uploadImages,resizeImages } from "../middlewares/uploadResizeMiddeware.js";
import uploadfile from "../middlewares/fileUploadMiddleware.js"

const routes=express.Router();

routes.use(express.static("public"))


routes.get('/',adminAuthentication,adminHome)
routes.get('/login',adminLoginPage)
routes.get('/signup',adminSignupPage)
routes.get('/addProduct',adminAuthentication,addProduct)
routes.get('/product_list',adminAuthentication,product_list)
routes.get('/category_list',adminAuthentication,category_list)
routes.get('/edit_product',adminAuthentication,edit_product)
routes.get('/delete_product',delete_product)
routes.get('/user_list',adminAuthentication,users)
routes.get('/user_details',user_details)
routes.get('/delete_category',delete_category)
routes.get('/addBanner',addBanner)
routes.get('/bannerList',adminAuthentication,bannerList)
routes.get('/edit_banner',editBanner)
routes.get('/delete_banner',deleteBanner)
routes.get('/addSubBanner',addSubBanner)
routes.get('/subBannerList',adminAuthentication,subBannerList)
routes.get('/edit_sub_banner',editSubBanner)
routes.get('/delete_sub_banner',deleteSubBanner)
routes.get('/coupon',adminAuthentication,coupon)
routes.get('/couponList',adminAuthentication,couponList)
routes.get('/edit_coupon',editCoupon)
routes.get('/delete_coupon',deleteCoupon)
routes.get('/customersList',adminAuthentication,customersList)
routes.get('/editIsActive',editIsActive)
routes.get('/updateCouponStatus',updateCouponStatus)
routes.get('/reviewList',adminAuthentication,reviewList)
routes.get('/orderList',adminAuthentication,orderList)
routes.get('/logout',logout)




routes.post('/signin',adminLogin)
routes.post('/signup',adminSignup)
routes.post('/productadd',uploadImages,resizeImages,productAdd)
routes.post('/add_category',uploadfile.single('category_thumbnail'),add_category)//for uploading single image
routes.post('/edit_single_product',uploadImages,resizeImages,edit_single_product)
routes.post('/edit_category',uploadfile.single('category_thumbnail'),edit_category)
routes.post('/banner',uploadfile.single('bannerImage'),banner)
routes.post('/subBanner',uploadfile.single('bannerImage'),subBanner)
routes.post('/addCoupon',addCoupon)
routes.post('/editCoupon',editCouponPost)
routes.post('/changeStatus',changeStatus)




export default routes;