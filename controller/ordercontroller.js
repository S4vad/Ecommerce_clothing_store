
// import orderModel from "../models/orderSchema";
import couponModel from "../models/couponSchema.js";
import cartModel from "../models/cartSchema.js";
import wishlistModel from "../models/wishlist.js";
import moment from "moment";
import addressModel from "../models/addressSchem.js";

export async function orderGet(req,res) {

    try {
        res.render('user/order')
        
    } catch (error) {
        res.send(error.message)
    }
    
}

export async function order(req,res) {
    try {
        // const userId=req.user;
        // // const price=Product.find({productId:req.body.productID}).Price;
        // // console.log(price)
       
        
        // await orderModel.create({
        //     'productId':req.body.productID,
        //     'quantity':req.body.quantity,
        //     'userId':userId,
        //     'size':req.body.size,
        //     // 'subTotal':req.body.quantity*req.body.
        // });
        // console.log(req.body.quickView)
        // if (req.body.quickView){
        //     res.redirect(`/quickView/${req.body.productID}`);

        // }else{
        //     res.redirect(`/productDetails/${req.body.productID}`);

        // }
        
         
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}


export async function coupon(req,res) {

    try {
        const user=req.user;
        const coupon=await couponModel.find()

        const cartItems = await cartModel.find().populate('productId');
        const cartCount = cartItems.length;

        const wisListItems=await wishlistModel.find().populate("productId")
        const wishListCount=wisListItems.length;

        res.render('user/coupon',{coupons:coupon,user,cartCount,wishListCount,moment,cart:cartItems})
        
    } catch (error) {
        res.send(error.message)
    }
    
}

function getDiscount(){
    
}



export async function checkout(req,res) {

    try {
        const user=req.user;
        const coupon=await couponModel.find()

        const cartItems = await cartModel.find().populate('productId');
        const cartCount = cartItems.length;

        const wisListItems=await wishlistModel.find().populate("productId")
        const wishListCount=wisListItems.length;

        const address=await addressModel.find()

        res.render('user/checkout',{coupons:coupon,user,cartCount,wishListCount,moment,cart:cartItems,address,alert:false})
        
    } catch (error) {
        res.send(error.message)
    }
    
}


