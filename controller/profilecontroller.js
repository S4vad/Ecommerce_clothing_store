
import { getUser } from "../helpers/mainhelper.js";
import cartModel from "../models/cartSchema.js";
import wishlistModel from "../models/wishlist.js";
import addressModel from "../models/addressSchem.js";
import orderModel from "../models/orderSchema.js"
import exp from "constants";
import getUserCartWishlistData from "../helpers/mainhelper.js";
import moment from "moment";




export async function profile(req,res){
    try {
        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        const addresses=await addressModel.find({user:userId}).select('address')

        console.log(addresses)

        res.render('user/profile',{user,alert:false,cart,cartCount,wishListCount,user,addresses})
        
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

      const checkAddress=await addressModel.findOne({user:userId})

      if (checkAddress) {
     
        checkAddress.address.push(newAddress);
        await checkAddress.save();
      ``} else {
        
        await addressModel.create({
            user: userId,
            address: [newAddress]
        });
    }




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


export async function profileOrder(req,res) {

    try {

        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        const orders=await orderModel.find({user:userId})
                                    .populate('address')
                                    .populate('user')
                                    .populate({
                                        path:'products.item',
                                        select:'Name Images Brand Price'   

                                        })
        console.log('the orders are ',JSON.stringify(orders,null,2))

        const structuredOrders=orders.map(order=>({
            id:order._id,
            totalAmount:order.totalamount,
            createdAt:order.createdAt,
            invoiceNumber:order.invoiceNumber,
            invoiceDate:order.invoiceDate,
            discount:order.discount,
            status:order.status,
            products:order.products.map(product =>({
                name:product.item.Name,
                image:product.item.Images[0],
                price:product.item.Price,
                brand:product.item.Brand,
                quantity:product.quantity
            }))


        }))
        app.locals.moment = moment;

        console.log('the sturcutredorder',JSON.stringify(structuredOrders,null,2))

        res.render('user/profileOrder',{order:structuredOrders,cart,user,wishListCount,cartCount})




        
    } catch (error) {

        res.send(error.message)
        
    }
    
}
