
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



async function expiredCouponUpdating(expiredCouponIds){
    for (const id of expiredCouponIds){
        
        try {
            await couponModel.findByIdAndUpdate(id,{$set:{isExpired:true}});  

        } catch (error) {
            console.log("error deleting coupon")
            
        }
    }
}


export async function coupon(req,res) {

    try {

        const coupons=await couponModel.find()

        const currentDate = new Date();

        var expiredCouponIds = coupons
        .filter( coupon => coupon.endDate<currentDate )
        .map( coupon =>coupon._id )

        expiredCouponUpdating(expiredCouponIds)
 

        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        res.render('user/coupon',{coupons:coupons,user,cartCount,wishListCount,moment,cart:cart})
        
    } catch (error) {
        res.send(error.message)
    }
    
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

        const appliedCoupon = await couponModel.findOne({ code: userCouponCode });

        if (!appliedCoupon) {
            return res.json({ success: false, message: 'Invalid coupon code or The coupon expired' });
        }

        const isExpired = appliedCoupon.isExpired;
        if (isExpired) {
            return res.json({ success: false, message: 'The coupon has expired.' });
        }

        //checking user is already used coupon or not

        const usedUser=appliedCoupon.users.find(user=>user.userId.toString()===userId.toString())
        const isUsed=usedUser?usedUser.isUsed : false;
        
        if (isUsed){
            return res.json({success:false,message:'The coupon is already used'})

        }

        const discount = appliedCoupon.discount;
        const cart = await cartModel.findOne({ user: userId })

        const newSubTotal = Number(cart.subtotal) - Number(discount);
        cart.subtotal = newSubTotal;

        await cart.save();

        //pushing used users to coupon schema

        const user={userId:userId,isUsed:true}

        appliedCoupon.users.push(user)

        await appliedCoupon.save()

        res.json({ success: true, message: `Coupon applied: ${discount}% discount` })


    } catch (error) {
        res.send(error.message);
    }
}

