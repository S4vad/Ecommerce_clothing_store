import { spawn } from 'child_process';
import path from 'path';
import pkg from 'ml-distance';
import axios from 'axios';

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
        const { user, cart, cartCount, wishListCount,wallet} = await getUserCartWishlistData(userId);

        const banner=await bannerModel.find()

        const category=await categorymodel.find()

        const product=await Product.find().populate('Categories').limit(12);

        const subBanner=await subBannerModel.find().populate('Categories')

       res.render('user/index',{user:user,
        product:product,
        cart:cart,
        cartCount:cartCount,
        banner:banner,
        category:category,
        wishListCount:wishListCount,
        subBanner:subBanner,
        wallet:wallet})
        
    } catch (error) {
        res.send(error.message)
        
    }
}

export async function loadMore(req,res) {
    try {
        const { page } = req.query;
        const productsPerPage = 12; 
        const skip = (page - 1) * productsPerPage;
    

        const products = await Product.find()
          .skip(skip)
          .limit(productsPerPage)
          .populate('Categories');
    
        res.json({ success: true, products });
      } catch (error) {
        console.error('Error loading more products:', error);
        res.json({ success: false, message: 'Failed to load more products' });
      }
    
}

export async function aboutPage(req,res) {
    try {
        const userId = req.user; 
        const { user, cart, cartCount, wishListCount,wallet} = await getUserCartWishlistData(userId);

        res.render('user/about',{user:user,
            cartCount:cartCount,
            wishListCount:wishListCount,
            wallet,
            cart})
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function contactPage(req,res) {
    try {
        const userId = req.user; 
        const { user, cart, cartCount, wishListCount,wallet} = await getUserCartWishlistData(userId);

        const message = req.query.message || " ";

        res.render('user/contact',{user:user,
            cartCount:cartCount,
            message:message,
            wishListCount:wishListCount,
            wallet,
            cart})
        
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
    
    const {fname,lname,email,password}=req.body;

    try {
        const hashedpassword=await bcrypt.hash(password,10);
        await usermodel.create({fname:fname,
            lname:lname,
            email:email,
            password:hashedpassword})

        const user = await usermodel.findOne({email});

        const token = jwt.sign({userId: user._id},"jwtid",{expiresIn:"5d"});  //jwt id its a secret id , amd we can use any name instead of jwtid
        res.cookie("userjwt", token, { httpOnly: true });
        res.redirect('/')

        
    } catch (error) {
        console.log(error.message)
        res.send("<script>alert('Signup failed. Please try again.')</script>");
        res.render('user/userSignup')
        
    }
} 




export async function checkPasswordStrength(req, res) {
    const { password } = req.body;

    const pythonPath = 'C:/Users/savad/AppData/Local/Programs/Python/Python311/python.exe';
    const scriptPath = 'python_ml_models/modelLoading/passwordChecker.py';  // Ensure the path is correct

    const pythonProcess = spawn(pythonPath, [scriptPath, password]);

    let output = '';

    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
    });
    
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script failed with code ${code}`);
            return res.status(500).json({ strength: 'Error' });
        }
    
    
    
        try {
            // Attempt to parse and return the Python script output
            const result = JSON.parse(output);
            res.json({ strength: result.strength });  
        } catch (err) {
            console.error('Error parsing Python output:', err);
            res.status(500).json({ strength: 'Error parsing result' });
        }
    });
    
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
    res.redirect('/');   // Redirect to the login page
}



export async function shop(req,res){
    try {

    
        const product=await Product.find().populate('Categories')

        const userId = req.user; 
        const { user, cart, cartCount, wishListCount,wallet} = await getUserCartWishlistData(userId);

        const category=await categorymodel.find();

        res.render('user/shop',{product:product,
            user:user,
            cartCount:cartCount,
            category:category,
            wishListCount:wishListCount,
            cart:cart,
            wallet});
        
    } catch (error) {
        res.send(error.message)
        
    }
}

export async function quickView(req, res) {
    try {
        const userId = req.user._id; 
        
        const id = req.params.id;
        const product = await Product.findById(id); 
        
        
        if (!product) {
            return res.status(404).send('Product not found');
        }

        const currentStock=product.Stock<=0;
        let stockStatus;
        if (currentStock){
            stockStatus="The product is Unavailable Now !!"
        }
    
        const message= stockStatus || req.query.message;

        res.render('user/quickView', { 
            product ,
            quantityAvailableOrNot:message});
    } catch (error) {
        res.status(500).send(error.message); // Use appropriate status code
    }
}


async function recommendation(productId) {
    try {
        console.log('the request sending')
        const response = await axios.post("http://localhost:8000/recommendations/", {
            product_id: productId,
            
        });
        console.log("API Response:", response.data);

        return response.data.recommendations;
    } catch (error) {
        console.error("Recommendation Error:", error.message);
        return [];
    }
}

export async function productDetails(req, res) {
    try {
        const { user, cart, cartCount, wishListCount, wallet } = await getUserCartWishlistData(req.user);
        const productId = req.params.id;


        const product = await Product.findById(productId);
        if (!product) throw new Error("Product not found.");

        const recommendedProductIds = await recommendation(productId);
        console.log("Recommended Product IDs:", recommendedProductIds);

  
        // Fetch recommended product details using only product_id
        const recommendedProducts = await Promise.all(
            recommendedProductIds.map(async (rec) => {
                return await Product.findById(rec.product_id); // Use rec.product_id here
            })
        );
        console.log("Recommended Products:", recommendedProducts);

        const quantityAvailableOrNot = product.Stock > 0 ? null : "The product is currently unavailable.";

        res.render("user/productDetails", {
            user,
            product,
            cart,
            cartCount,
            wishListCount,
            wallet,
            recommendedProducts,
            quantityAvailableOrNot
        });
    } catch (error) {
        console.error("Error in productDetails:", error.message);
        res.status(500).send(error.message);
    }
}





export async function cart(req,res) {
    try {
        const userId = req.user; 
        const { user, cart, cartCount, wishListCount,wallet} = await getUserCartWishlistData(userId);

        res.render('user/cart',{
            user:user,
            cart:cart,
            cartCount:cartCount,
            wishListCount:wishListCount,
            userId:userId,
            wallet})

        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function cartAdd(req, res) {
    try {
        const userId = req.user; 
        const quantity = Number(req.body.quantity) || 1;
        const productId =  req.query.productId || req.body.productID ;
        
        const current_product_specific = await Product.findById(productId); 
        if (!current_product_specific) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const stock = current_product_specific.Stock;

        const updatedStock = stock - quantity;
        let quantityAvailableOrNot = "";
        if (updatedStock >= 0) {
            await Product.findByIdAndUpdate(productId, { $set: { Stock: updatedStock } });
        } else {
            quantityAvailableOrNot = `${quantity} units requested; only ${stock} available.`;
        }

        const current_price = Number(current_product_specific.Price);
        const current_Total = quantity * current_price;

        const product = { 
            item: productId, 
            quantity: quantity,
            currentProductTotal: current_Total
        };
        
        const cart = await cartModel.findOne({ user: userId });

        if (updatedStock>=0 && cart) {
            const productIndex = cart.products.findIndex(p => p.item.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
                cart.products[productIndex].currentProductTotal += current_Total;
            } else {
                cart.products.push(product);
            }

            cart.totalQuantity =Number(cart.totalQuantity)+Number(quantity);
            cart.subtotal =Number(cart.subtotal) +Number(current_Total);
            await cart.save(); 
        } else {
            await cartModel.create({
                user: userId,
                products: [product],
                totalQuantity: quantity,
                subtotal: current_Total
            });
        }


        if (req.xhr) {
            // Return JSON if it is an AJAX request
            return res.status(200).json({ message: 'Product added to cart successfully', quantityAvailableOrNot });
        } else {
            // Redirect if it's a normal request
            const redirectUrl = req.body.quickView 
                ? `/quickView/${productId}?message=${encodeURIComponent(quantityAvailableOrNot)}` 
                : `/productDetails/${productId}?message=${encodeURIComponent(quantityAvailableOrNot)}`;
            return res.redirect(redirectUrl);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export async function wishlist(req,res) {
    try {

        const userId = req.user; 
        const { user, cartCount, wishListCount,cart,wallet} = await getUserCartWishlistData(userId);

        const wishList = await wishlistModel.findOne({ user: userId }).populate('products.item');

        res.render('user/wishList',{
            user:user,
            wishList:wishList,
            cartCount:cartCount,
            wishListCount:wishListCount,
            cart,
            wallet})
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}






export async function addWishlist(req, res) {
    try {
        const userId = req.user; 
        const productId=req.params.id;
 
        const wishlist = await wishlistModel.findOne({ user: userId });
        let message ="";
        const product ={item:productId}

        if (wishlist) {
            const productIndex = wishlist.products.findIndex(p => p.item.toString() === productId);

            if (productIndex !== -1) {
                message="product Added already"
            } else {

                wishlist.products.push(product);
                message="product Added succesfully"
            }
            
            await wishlist.save(); 
 
        } else {

            await wishlistModel.create({
                user: userId,
                products: [product],

            });
            message = "product Added succesfully";
        }

        const updatedWishlist = await wishlistModel.findOne({ user: userId });
        const wishlistCount = updatedWishlist.products.length;

        res.json({
            message:message,
            wishlistCount:wishlistCount

        })

        
    } catch (error) {
        res.status(500).send(error.message);
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


        const userCart = await cartModel.findOne({ user: user }).populate('products.item');
        productPrice= userCart.products.Price;
        const productIndex = userCart.products.findIndex(p => p.item.toString() === delId);
        cart.products[productIndex].currentProductTotal=Number(cart.products[productIndex].currentProductTotal)-productPrice;

        res.json({remainingSubTotal:remainingSubTotal})

        
    } catch (error) {
        res.status(500).jason({message:error.message})
        
    }
    
}




export async function review(req, res) {
    try {
        const userId = req.user;
        const productId = req.query.productId;

        const { rating, review, name, email } = req.body;

        // Define the Python executable path and script path
        const pythonPath = 'C:/Users/savad/AppData/Local/Programs/Python/Python311/python.exe'; 
        const scriptPath = path.join(process.cwd(), 'python_ml_models', 'modelLoading', 'sentimentAnalysis.py'); 


        const pythonProcess = spawn(pythonPath, [scriptPath, review]);

        // Capture the output of the Python script
        pythonProcess.stdout.on('data', (data) => {
            const reviewStatus = data.toString().trim(); 
            console.log('Review Status:', reviewStatus); 


            reviewModel.create({
                user: userId,
                product: productId,
                rating: rating,
                review: review,
                name: name,
                email: email,
                reviewStatus: reviewStatus
            });

            res.redirect(`/productDetails/${productId}`);
        });

        // Handle errors
        pythonProcess.stderr.on('data', (error) => {
            console.error('Error running Python script:', error.toString());
            res.status(500).send('Error processing review');
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
}




export async function wishListDelete(req, res) {
    try {
        const userId = req.user; // Assumes you have the user's ID from req.user
        const productId = req.params.id; // Product ID to delete from wishlist
        
        // Find the wishlist and remove the specific product item
       await wishlistModel.findOneAndUpdate(
            { user: userId },
            { $pull: { products: { item: productId } } }, // Removes the specific product from products array
            { new: true } // Returns the updated wishlist document
        );


        res.status(200).send("Product removed from wishlist successfully");
        
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function userBanned(req, res) {
    try {
        res.render('errors/userBanned')
        
    } catch (error) {
        res.send(error.message);
    }
}



