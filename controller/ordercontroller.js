
// import orderModel from "../models/orderSchema";
import couponModel from "../models/couponSchema.js";
import cartModel from "../models/cartSchema.js";
import wishlistModel from "../models/wishlist.js";
import moment from "moment";
import addressModel from "../models/addressSchem.js";
import getUserCartWishlistData from "../helpers/mainhelper.js";
import { cart } from "./usercontroller.js";

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




export async function applyCoupon(req, res) {
    try {
        const userCouponCode = req.body.coupon.trim(); // Trim to remove any extra spaces
        const userId = req.user; // Ensure userId is retrieved from req.user or JWT

        // Find the coupon in the database
        const appliedCoupon = await couponModel.findOne({ code: userCouponCode });
        
        if (appliedCoupon) {
            const discount = appliedCoupon.discount;

            // Find the user's cart
            const cart = await cartModel.findOne({ user: userId });
            
            if (cart) {
                // Calculate the new subtotal after applying the discount
                const newSubTotal = Number(cart.subtotal) - Number(discount);
                
                // Update the subtotal and discount fields in the cart
                cart.subtotal = newSubTotal; 
                cart.discount = discount; // Save discount applied

                // Save changes to the cart document
                await cart.save();

                res.json({ success: true, message: `Coupon applied: ${discount}% discount` });
            } else {
                res.json({ success: false, message: 'Cart not found for this user.' });
            }
        } else {
            res.json({ success: false, message: 'Invalid coupon code' });
        }
    } catch (error) {
        res.send(error.message);
    }
}

