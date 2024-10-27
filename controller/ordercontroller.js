
// import orderModel from "../models/orderSchema";
import couponModel from "../models/couponSchema.js";
import cartModel from "../models/cartSchema.js";
import wishlistModel from "../models/wishlist.js";
import moment from "moment";
import addressModel from "../models/addressSchem.js";
import getUserCartWishlistData from "../helpers/mainhelper.js";
import { cart } from "./usercontroller.js";
import Razorpay from "razorpay";

import 'dotenv/config'; // Load environment variables from .env file



const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });


export async function orderGet(req,res) {

    try {
        res.render('user/order')
        
    } catch (error) {
        res.send(error.message)
    }
    
}

export async function order(req,res) {

    const {  user,paymentMethod,appliedCoupon} = req.body;
    console.log('the applied coupon'+appliedCoupon)

    const addre=await addressModel.findOne({user:user}).select('address');
    const address=addre.address[0]

    const cart=await cartModel.findOne({user:user}).populate("products.item");

    const coupon=await couponModel.find({code:appliedCoupon})

    const discountPercentage = Number(coupon.discount);
    console.log('the coupon discout is '+discountPercentage)
    const subtotal=Number(cart.subtotal)
    

    const discountAmount = (subtotal * discountPercentage) / 100; // Calculate discount amount
    const amount = Math.floor(subtotal - discountAmount) || subtotal;

    console.log("Calculated amount (in paise):", amount * 100); // Log amount in paise



    try {
      const options = {
        amount: amount * 100, // Razorpay expects the amount in the smallest currency unit (e.g., paise for INR)
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
      };
  
      const order = await razorpay.orders.create(options);
      res.status(200).json({ success: true, order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Order creation failed' });
    }
    
}


export async function verifyPayment(req,res) {
    try {
        const { payment, order } = req.body;

        const generatedSignature = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(`${order.id}|${payment.razorpay_payment_id}`)
          .digest('hex');
      
        if (generatedSignature === payment.razorpay_signature) {
          // Generate a unique invoice number
          const invoiceNumber = Math.floor(100000 + Math.random() * 900000);
      
          // Save order details to the database
          const newOrder = new orderModel({
            user: order.user,
            address: order.address,
            payment: payment.razorpay_payment_id,
            products: order.products,
            totalamount: order.amount / 100, // Convert back to INR
            status: 'Completed',
            paymentMethod: 'Razorpay',
            invoiceNumber: invoiceNumber,
            invoiceDate: new Date(),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          });
      
          await newOrder.save();
          res.status(200).json({ success: true });
        } else {
          res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
         
        
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

        const address=await addressModel.findOne({user:userId}).select('address')
        console.log('the address is '+address)

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
            return res.json({ success: false, message: 'Invalid code' });
        }

        const isExpired = appliedCoupon.isExpired;
        if (isExpired) {
            return res.json({ success: false, message: 'Coupon expired' });
        }

        //checking user is already used coupon or not

        const usedUser=appliedCoupon.users.find(user=>user.userId.toString()===userId.toString())
        const isUsed=usedUser?usedUser.isUsed : false;
        
        if (isUsed){
            return res.json({success:false,message:'The coupon is already used'})

        }

        const discountPercentage = Number(appliedCoupon.discount);
        const cart = await cartModel.findOne({ user: userId })

        const subtotal = Number(cart.subtotal); 
        const discountAmount = (subtotal * discountPercentage) / 100; // Calculate discount amount
        const newSubTotal = Math.floor(subtotal - discountAmount);


        await cart.save();

        //pushing used users to coupon schema

        const user={userId:userId,isUsed:true}

        appliedCoupon.users.push(user)

        await appliedCoupon.save()


        console.log('the nerw'+newSubTotal)

        res.json({ success: true, message: `Applied ${discountPercentage}% discount`, newSubTotal: newSubTotal ,couponCode:userCouponCode});



    } catch (error) {
        res.send(error.message);
    }
}

