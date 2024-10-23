
import { getUser } from "../helpers/mainhelper.js";
import cartModel from "../models/cartSchema.js";
import wishlistModel from "../models/wishlist.js";
export async function profile(req,res){
    try {
        const userId=req.user;
        const user=getUser(userId)
        

        const cart = await cartModel.find({ userId: userId}).populate('productId');

       
        const cartItems = await cartModel.find().populate('productId');
        const cartCount = cartItems.length;

        const wisListItems=await wishlistModel.find().populate("productId")
        const wishListCount=wisListItems.length;

        res.render('user/profile',{user,alert:false,cart,cartCount,wishListCount,user})
        
    } catch (error) {
        res.status(500).send(error.message)
        
    }
}