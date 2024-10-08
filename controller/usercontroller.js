
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usermodel from "../models/userSchema.js";
import Product from "../models/productSchema.js";
import { name } from "ejs";
import { getUser } from "../helpers/mainhelper.js";
import cartModel from "../models/cartSchema.js";
import bannerModel from "../models/bannerSchema.js"
import categorymodel from "../models/categorySchema.js";
import contactModel from "../models/contactSchema.js";
import wishlistModel from "../models/wishlist.js";




export async function userHome(req,res){
    try {
        const userId=req.user;
        const user=await getUser(userId);
        
        const cart = await cartModel.find({ userId: userId}).populate('productId');

        console.log(cart)
        const cartItems = await cartModel.find().populate('productId');
        const cartCount = cartItems.length;
        const banner=await bannerModel.find()
        const category=await categorymodel.find()
        const product=await Product.find().populate('Categories');
       

        

        res.render('user/index',{user:user,product:product,cart:cart,cartCount:cartCount,banner:banner,category:category})
        //res.local.user=user; its another method to send something to ejs file like above solution
        
    } catch (error) {
        res.send(error.message)
        
    }
}

export async function aboutPage(req,res) {
    try {
        const userId=req.user;
        const user=await getUser(userId);

        const cartItems = await cartModel.find().populate('productId');
        const cartCount = cartItems.length;

        res.render('user/about',{user:user,cartCount:cartCount})
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function contactPage(req,res) {
    try {
        const userId=req.user;
        const user=await getUser(userId);

        const cartItems = await cartModel.find().populate('productId');
        const cartCount = cartItems.length;

    

        const message = req.query.message || " ";



        res.render('user/contact',{user:user,cartCount:cartCount,message:message})
        
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

        const userId=req.user;
        const user=await getUser(userId);

        const cartItems = await cartModel.find().populate('productId');
        const cartCount = cartItems.length;

        const category=await categorymodel.find()


        // console.log(product)
        res.render('user/shop',{product:product,user:user,cartCount:cartCount,category:category})



        
    } catch (error) {
        res.send(error.message)
        
    }
}

export async function quickView(req, res) {
    try {
        const userId=req.user;
        const user=await getUser(userId);
        const id = req.params.id;
        const product = await Product.findById(id); 
        // Use findById for a single product
    
    
        
        
        if (!product) {
            return res.status(404).send('Product not found'); // Handle case where product does not exist
        }
    

        
        res.render('user/quickView', { product ,user});
    } catch (error) {
        res.status(500).send(error.message); // Use appropriate status code
    }
}


export async function productDetails(req,res) {
    try {
        const userId=req.user;
        const user=await getUser(userId);


        const id=req.params.id;
        const product=await Product.findById(id);

        const cart=await cartModel.find().populate(['productId','userId']);

        const cartItems = await cartModel.find().populate('productId');
        const cartCount = cartItems.length;
      
        res.render('user/productDetails',{user,product,cart,cartCount:cartCount})
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function cart(req,res) {
    try {
        const user=req.user;
        const cart=await cartModel.find().populate(['productId','userId']);
        const cartItems = await cartModel.find().populate('productId');
        const cartCount = cartItems.length;
        
        res.render('user/cart',{user:user,cart:cart,cartCount:cartCount})
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function cartAdd(req,res) {
    try {
        const userId=req.user;
        
        await cartModel.create({
            'productId':req.body.productID,
            'quantity':req.body.quantity,
            'userId':userId,
            'size':req.body.size
        })
        console.log(req.body.quickView)
        if (req.body.quickView){
            res.redirect(`/quickView/${req.body.productID}`);

        }else{
            res.redirect(`/productDetails/${req.body.productID}`);

        }
        
         
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function wishlist(req,res) {
    try {
        const user=req.user;
        const cart=await cartModel.find().populate(['productId','userId']);
        const cartItems = await cartModel.find().populate('productId');
        const cartCount = cartItems.length;
        
        res.render('user/cart',{user:user,cart:cart,cartCount:cartCount})
        
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







