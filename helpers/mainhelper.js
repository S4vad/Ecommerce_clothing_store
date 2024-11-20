import usermodel from "../models/userSchema.js";
import cartModel from "../models/cartSchema.js";
import wishlistModel from "../models/wishlist.js";
import walletModel from "../models/walletSchema.js";





export async function getUser(userId){

    if (!userId) 
        return false;
    try {
        const userDetails=await usermodel.findById(userId);
     
        return userDetails;
        
    } catch (error) {
        console.log(error)
        return false;
        
    }
};


export default async function getUserCartWishlistData(userId) {
    const user = await getUser(userId);
    const cart = await cartModel.findOne({ user: userId }).populate('products.item');
    const cartCount = cart ? cart.products.length : 0; 
    const wisListItems = await wishlistModel.findOne({ user: userId }).populate("products.item");
    const wishListCount = wisListItems ? wisListItems.products.length : 0;
    const wallet = await  walletModel.findOne({user:userId})

    return {
        user,
        cart,
        cartCount,
        wishListCount,
        wallet
    };
}
