
import { getUser } from "../helpers/mainhelper.js";
import cartModel from "../models/cartSchema.js";
import wishlistModel from "../models/wishlist.js";
import addressModel from "../models/addressSchem.js";
import exp from "constants";
import getUserCartWishlistData from "../helpers/mainhelper.js";



export async function profile(req,res){
    try {
        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        const address=await addressModel.find()

        res.render('user/profile',{user,alert:false,cart,cartCount,wishListCount,user,address})
        
    } catch (error) {
        res.status(500).send(error.message)
        
    }
}

export async function profileAddress(req,res) {

    try {

        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        const address=await addressModel.find()

        res.render('user/profileAddress',{address,cart,user,wishListCount,cartCount})


        
    } catch (error) {

        res.send(error.message)
        
    }
    
}


export async function addAddressPost(req,res) {
    try {
        const userId=req.user;
        const user=getUser(userId)

        const {name,address,city,state,zip,phone,email}=req.body;

        const newAddress = {
            name: name,
            address: address,
            city: city,
            state: state,
            zip: zip,
            phone: phone,
            email: email
        };

        await addressModel.create({
            user: userId, 
            address: [newAddress] 
        });




        res.redirect('/profileAddress')
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}


export async function editAddress(req,res) {

     try {
        const AddressId=req.query.id;
        const userId=req.user;

        const {name,address,city,state,zip,phone,email}=req.body;
    
       
        const newAddress = {
            name: name,
            address: address,
            city: city,
            state: state,
            zip: zip,
            phone: phone,
            email: email
        };
        await addressModel.findOneAndUpdate(
            { _id: AddressId, user: userId }, 
            { $set: { address: [newAddress] } }, 
             
        );
    
    
        res.redirect('/profileAddress')
        
        
        
    } catch (error) {
        res.send(error.message)
    }
    
}


export async function deleteAddress(req,res) {

    try {
       const AddressId=req.body.address;

       await addressModel.findByIdAndDelete(AddressId)
       res.sendStatus(200); 
       
       
       
   } catch (error) {
       res.send(error.message)
       res.sendStatus(500); 
   }
   
}


export async function profileDashboard(req,res){
    try {
        const userId=req.user;
        const user=getUser(userId)
        

        const cart = await cartModel.find({ userId: userId}).populate('productId');

       
        const cartItems = await cartModel.find().populate('productId');
        const cartCount = cartItems.length;

        const wisListItems=await wishlistModel.find().populate("productId")
        const wishListCount=wisListItems.length;

        res.render('user/profileDashboard',{user,alert:false,cart,cartCount,wishListCount,user})
        
    } catch (error) {
        res.status(500).send(error.message)
        
    }
}
