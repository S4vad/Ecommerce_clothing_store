
// import orderModel from "../models/orderSchema";
import couponModel from "../models/couponSchema.js";
import cartModel from "../models/cartSchema.js";
import wishlistModel from "../models/wishlist.js";
import moment from "moment";
import addressModel from "../models/addressSchem.js";
import getUserCartWishlistData from "../helpers/mainhelper.js";

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

        const coupon=await couponModel.find()

        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        res.render('user/coupon',{coupons:coupon,user,cartCount,wishListCount,moment,cart:cart})
        
    } catch (error) {
        res.send(error.message)
    }
    
}

function getDiscount(){
    
}



export async function checkout(req,res) {

    try {
        const coupon=await couponModel.find()

        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        const address=await addressModel.find()

        res.render('user/checkout',{
            coupons:coupon,
            user,
            cartCount,
            wishListCount,
            moment,
            cart:cart,
            address,
            alert:false,
            discount:345,
            totalDiscount:345})
        
    } catch (error) {
        res.send(error.message)
    }
    
}


