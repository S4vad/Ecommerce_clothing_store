import express, { Router } from "express";
import { adminHome,adminLoginPage,adminLogin,adminSignup, adminSignupPage,
    addProduct,productAdd ,product_list,category_list,add_category,edit_product,
    delete_product,users,user_details,edit_single_product,delete_category,edit_category,
    addBanner,banner,bannerList,editBanner,deleteBanner,addSubBanner,subBanner,subBannerList,
    deleteSubBanner,editSubBanner,coupon,addCoupon,
    couponList,editCoupon,deleteCoupon,editCouponPost,customersList} from "../controller/admincontroller.js";

import { uploadImages,resizeImages } from "../middlewares/uploadResizeMiddeware.js";
import uploadfile from "../middlewares/fileUploadMiddleware.js"

const routes=express.Router();

routes.use(express.static("public"))


routes.get('/',adminHome)
routes.get('/login',adminLoginPage)
routes.get('/signup',adminSignupPage)
routes.get('/addProduct',addProduct)
routes.get('/product_list',product_list)
routes.get('/category_list',category_list)
routes.get('/edit_product',edit_product)
routes.get('/delete_product',delete_product)
routes.get('/user_list',users)
routes.get('/user_details',user_details)
routes.get('/delete_category',delete_category)
routes.get('/addBanner',addBanner)
routes.get('/bannerList',bannerList)
routes.get('/edit_banner',editBanner)
routes.get('/delete_banner',deleteBanner)
routes.get('/addSubBanner',addSubBanner)
routes.get('/subBannerList',subBannerList)
routes.get('/edit_sub_banner',editSubBanner)
routes.get('/delete_sub_banner',deleteSubBanner)
routes.get('/coupon',coupon)
routes.get('/couponList',couponList)
routes.get('/edit_coupon',editCoupon)
routes.get('/delete_coupon',deleteCoupon)
routes.get('/customersList',customersList)






routes.post('/signin',adminLogin)
routes.post('/signup',adminSignup)
routes.post('/productadd',uploadImages,resizeImages,productAdd)
routes.post('/add_category',uploadfile.single('category_thumbnail'),add_category)//for uploading single image
routes.post('/edit_single_product',edit_single_product)
routes.post('/edit_category',uploadfile.single('category_thumbnail'),edit_category)
routes.post('/banner',uploadfile.single('bannerImage'),banner)
routes.post('/subBanner',uploadfile.single('bannerImage'),subBanner)
routes.post('/addCoupon',addCoupon)
routes.post('/editCoupon',editCouponPost)



export default routes;