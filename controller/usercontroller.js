
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usermodel from "../models/userSchema.js";
import Product from "../models/productSchema.js";
import { getUser } from "../helpers/mainhelper.js";
import cartModel from "../models/cartSchema.js";
import bannerModel from "../models/bannerSchema.js"
import categorymodel from "../models/categorySchema.js";
import contactModel from "../models/contactSchema.js";
import wishlistModel from "../models/wishlist.js";
import subBannerModel from "../models/subBanners.js";
import exp from "constants";
import getUserCartWishlistData from "../helpers/mainhelper.js";
import reviewModel from "../models/reviewSchema.js";



export async function userHome(req,res){
    try {
        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);
        console.log("the anser" +user,cart,cartCount)

        const banner=await bannerModel.find()

        const category=await categorymodel.find()

        const product=await Product.find().populate('Categories');

        const subBanner=await subBannerModel.find().populate('Categories')

       res.render('user/index',{user:user,product:product,cart:cart,cartCount:cartCount,banner:banner,category:category,wishListCount:wishListCount,subBanner:subBanner})
        
    } catch (error) {
        res.send(error.message)
        
    }
}

export async function aboutPage(req,res) {
    try {
        const userId = req.user._id; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        res.render('user/about',{user:user,cartCount:cartCount,wishListCount:wishListCount})
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function contactPage(req,res) {
    try {
        const userId = req.user._id; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        const message = req.query.message || " ";

        res.render('user/contact',{user:user,cartCount:cartCount,message:message,wishListCount:wishListCount})
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}




export async function signup(req,res){
    try {
    res.render('user/userSignup')
        
    } catch (error) {
        
    }
}

export async function userSignup(req,res){
    
    const {email,password}=req.body;
    try {
        const hashedpassword=await bcrypt.hash(password,10);
        await usermodel.create({email:email,password:hashedpassword})
        res.redirect('/')

        
    } catch (error) {
        console.log(error.message)
        res.send("<script>alert('product not created successfully')</script>");
        
    }
} 

export async function login(req,res){
    res.render('user/userLogin',{message:""})
}

export async function userLogin(req,res){
    const {email,password}=req.body;
    

    
    try {
        const user = await usermodel.findOne({email});
        
        if (!user) {
            return res.render('user/userLogin',{message:"Email is not registered"});
        }
        
        const isPasswordCorrect =await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.render('user/userLogin',{message:"Incorrect password"});
        }

        const token = jwt.sign({userId: user._id},"jwtid",{expiresIn:"5d"});  //jwt id its a secret id , amd we can use any name instead of jwtid
        res.cookie("userjwt", token, { httpOnly: true });  //for storing cokkies
       
        return res.redirect('/');
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
}


export async function logout(req, res) {
    res.clearCookie('userjwt'); // Clear the 'token' cookie
    res.redirect('/login');   // Redirect to the login page
}



export async function shop(req,res){
    try {

    
        const product=await Product.find().populate('Categories')

        const userId = req.user._id; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        const category=await categorymodel.find();

        res.render('user/shop',{product:product,user:user,cartCount:cartCount,category:category,wishListCount:wishListCount,cart:cart});
        
    } catch (error) {
        res.send(error.message)
        
    }
}

export async function quickView(req, res) {
    try {
        const userId = req.user._id; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);
        const id = req.params.id;
        const product = await Product.findById(id); 
        
        
        if (!product) {
            return res.status(404).send('Product not found'); // Handle case where product does not exist
        }
    

        
        res.render('user/quickView', { product ,user,cartCount,wishListCount,cart});
    } catch (error) {
        res.status(500).send(error.message); // Use appropriate status code
    }
}


export async function productDetails(req, res) {
    try {
        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        const id = req.params.id;
        const product = await Product.findById(id);

        const currentStock=product.Stock<=0;
        let stockStatus;
        if (currentStock){
            stockStatus="The product is Unavailable Now !!"
        }
    
        const message= stockStatus || req.query.message;
        
        res.render('user/productDetails', { user, product, cart, cartCount, wishListCount ,quantityAvailableOrNot:message});
        
    } catch (error) {
        console.error('Error in productDetails:', error); 
        res.send(error.message);
    }
}





export async function cart(req,res) {
    try {
        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        res.render('user/cart',{
            user:user,
            cart:cart,
            cartCount:cartCount,
            wishListCount:wishListCount,
            userId:userId})

        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function cartAdd(req, res) {
    try {
        const userId = req.user; 
        const quantity = Number(req.body.quantity);

        const current_product_specific = await Product.findById(req.body.productID); 
        const stock=current_product_specific.Stock;
        
        if (!current_product_specific) {
            throw new Error('Product not found');
        }

        const current_price = current_product_specific.Price;
        const current_Total = quantity * current_price;

        const product = { 
            item: req.body.productID, 
            quantity: quantity ,
            currentProductTotal:current_Total
        };
            
        const cart = await cartModel.findOne({ user: userId });

        if (cart) {
            // check if the product is already in the cart
            const productIndex = cart.products.findIndex(p => p.item.toString() === req.body.productID);

            if (productIndex !== -1) {
                // Product exists in cart, update its quantity
                cart.products[productIndex].quantity = Number(cart.products[productIndex].quantity) + quantity; 
                cart.products[productIndex].currentProductTotal=Number(cart.products[productIndex].currentProductTotal)+current_Total;
                
            } else {

                cart.products.push(product);
            }

            cart.totalQuantity = Number(cart.totalQuantity) + quantity; 
            cart.subtotal = Number(cart.subtotal) + current_Total;
            
            await cart.save(); 
        } else {

            await cartModel.create({
                user: userId,
                products: [product],
                totalQuantity: quantity,
                subtotal: current_Total
            });
        }

        const updatedStock = stock - quantity;

        

        let quantityAvailableOrNot = ""; 

        if (updatedStock >= 0) {
            await Product.findByIdAndUpdate(req.body.productID, { $set: { Stock: updatedStock } });
        } else {
            quantityAvailableOrNot = ` ${quantity} units requested; only ${stock} available. `;
        }

        res.locals.quantityAvailableOrNOt = quantityAvailableOrNot;

        const redirectUrl = req.body.quickView 
            ? `/quickView/${req.body.productID}?message=${encodeURIComponent(quantityAvailableOrNot)}` 
            : `/productDetails/${req.body.productID}?message=${encodeURIComponent(quantityAvailableOrNot)}`;

        res.redirect(redirectUrl);
        
    } catch (error) {
        res.status(500).send(error.message);
    }
}


export async function wishlist(req,res) {
    try {


        const userId = req.user; 
        const { user, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        const wishList=await wishlistModel.find().populate(['productId','userId'])
        
        res.render('user/wishList',{user:user,wishList:wishList,cartCount:cartCount,wishListCount:wishListCount})
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}



export async function wishlistAdd(req,res) {
    try {
        const id=req.params.id;
        const user=req.user
        
        await wishlistModel.create({
            'productId':id,
            'userId':user
        })
        res.redirect('/')

        
    } catch (error) {
        res.send(error.message)
        
    }
    
}


export async function addContact(req,res) {
    try {
        const userId=req.user;
        
        await contactModel.create({
            'userId':userId,
            'email':req.body.email,
            'message':req.body.msg,

        
        })
        const message="Thank you for contacting US we will shortly contact you"
       
       // Redirect with query params

        res.redirect(`/contact?message=${(message)}`);

         
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}




export async function filter(req, res) {
    try {



        const priceRange = req.body.priceRange; 

        

        let product;

        switch (priceRange) {
            case '500AndBelow':
                product = await Product.find({ Price: { $lt: 500 } }).populate("Categories");
                break;  
        
            case '501To1000':
                product = await Product.find({ Price: { $gt: 500, $lt: 1001 } }).populate("Categories");
                break;  
        
            case '1001To5000':
                product = await Product.find({ Price: { $gt: 1001, $lt: 5001 } }).populate("Categories");
                break;  
        
            case '5001To10000':
                product = await Product.find({ Price: { $gt: 5001, $lt: 10001 } }).populate("Categories");
                break;  
        
            case '10001AndAbove':
                product = await Product.find({ Price: { $gt: 10000 } }).populate("Categories");
                break; 
        }


        
        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        const banner=await bannerModel.find()

        const category=await categorymodel.find()
        
        const subBanner=await subBannerModel.find().populate('Categories')

        res.render('user/index',{user:user,cart:cart,cartCount:cartCount,banner:banner,category:category,wishListCount:wishListCount,subBanner:subBanner,product:product || []})

    } catch (error) {
        res.send(error.message);
    }
}


export async function categoryShop(req,res) {
    try {
        var category_name=req.query.category || "default";
    
        if (category_name === "default") {
            var product = await Product.find().populate('Categories');
        } else {
            const category = await categorymodel.findOne({ category_name: category_name });
            if (category) {
                var product = await Product.find({ Categories: category._id }).populate('Categories');
            } else {
                
                var product = [];
            }
        }

        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        res.render('user/categoryShop',{product:product,user:user,cartCount:cartCount,wishListCount:wishListCount,category_name:category_name})

        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function search(req,res) {

    try {

        const search=req.body.search;
        const product=await Product.find({Name:{$regex:search}}).populate('Categories')

        const userId = req.user; 
        const { user, cart, cartCount, wishListCount } = await getUserCartWishlistData(userId);

        

        const category = await categorymodel.findOne({ category_name: search });

        
        let pd = null;
        if (category) {
            pd = await Product.find({ Categories: category._id }).populate('Categories');
        }
        if(!product && !pd)
        {
            res.send('product not found')
        }

        var category_name="";

        res.render('user/categoryShop',{product:pd || product,user:user,cartCount:cartCount,wishListCount:wishListCount,category_name:category_name})


        
    } catch (error) {
        res.send(error.message)
        
    }
    
}


export async function cartDelete(req, res) {
    try {
        const userId = req.user; 
        const productId = req.params.id; 
        
        const userCart = await cartModel.findOne({ user: userId });

        if (!userCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = userCart.products.findIndex(p => p.item.toString() === productId);

        if (productIndex !== -1) {
            // Get the current product's quantity and total price before removal
            const productToRemove = userCart.products[productIndex];
            const quantityToRemove = productToRemove.quantity;
            const currentProductTotal = productToRemove.currentProductTotal;

            // Remove the product from the products array
            userCart.products.splice(productIndex, 1);

            // Update totalQuantity and subtotal after product removal
            userCart.totalQuantity -= quantityToRemove;
            userCart.subtotal -= currentProductTotal;

            // Save the updated cart
            await userCart.save();

            // Send JSON response for AJAX success
            return res.status(200).json({ message: 'Product removed from cart' });
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



export async function cartSubTotalUpdate(req,res) {
    try {
        const productId =req.params.id;
        const userId=req.user;
        const cart=await cartModel.find({user:userId});

     

        //extra changer


        const userCart = await cartModel.findOne({ user: user }).populate('products.item');
        productPrice= userCart.products.Price;
        const productIndex = userCart.products.findIndex(p => p.item.toString() === delId);
        cart.products[productIndex].currentProductTotal=Number(cart.products[productIndex].currentProductTotal)-productPrice;

        res.json({remainingSubTotal:remainingSubTotal})

        
    } catch (error) {
        res.status(500).jason({message:error.message})
        
    }
    
}


export async function review(req,res) {

    try {
        const userId=req.user;
        const productId=req.query.productId;

        const {rating,review,name,email}=req.body;

        await reviewModel.create({
            user:userId,
            product:productId,
            rating:rating,
            review:review,
            name:name,
            email:email

        })
        res.redirect(`/productDetails/${productId}`)

        
    } catch (error) {
        res.send(error.message)
        
    }
    
}












