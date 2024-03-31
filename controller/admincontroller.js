import jwt from "jsonwebtoken";
import adminModel from "../models/adminSchema.js"
import productModel from "../models/productSchema.js"
import usermodel from "../models/userSchema.js";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import exp from "constants";
import categorymodel from "../models/categorySchema.js";
import fs from "fs";



export async function adminHome(req,res){
        res.render('admin/index')
}
    


export function adminLoginPage(req,res){
    res.render('admin/adminLogin',{message:""})
}

export function adminSignupPage(req,res){
    res.render('admin/adminRegister')
}

export async function addProduct(req,res){
    try {
        const category=await categorymodel.find()

        res.render('admin/addProduct',{category})
        
    } catch (error) {
        
    }

}

export async function product_list(req,res){
    try {
        const products= await productModel.find()
        const Category = await productModel.find().populate('Categories');
        // const products = await productmodel.find().populate('category') 
        // console.log(category)
        res.render('admin/product_list',{products,Category})
        
    } catch (error) {
        res.render(error)
    }
    
}




export async function adminSignup(req,res){
    console.log(req.body)
    const {userName,password}=req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword)
        await adminModel.create({userName:userName,password:hashedPassword})
        
        res.redirect('/admin')
        
    } catch (error) {
        console.log(error.message)
        res.send("<script>alert('product not created successully');</script>")

    }
    
}


 export async function adminLogin(req,res){
    console.log(req.body)
    const {userName,password}=req.body;
    try {
        const emailExist=await adminModel.findOne({userName})
        console.log(emailExist)
        if(!emailExist){
            
            return res.render('admin/adminLogin',{message:"email is not registerd "})
            
        }
        const istrue= bcrypt.compare(password, emailExist.password);
        if(!istrue){
            return res.render('admin/adminLogin',{message:"your password is wrong"})


        }
        const token=jwt.sign({adminID:emailExist._id},"sunoos",{expiresIn:"5d"})
        res.cookie("jwts",token,{httpOnly:true})
        return res.redirect('/admin')



        
    } catch (error) {
        console.log(error.message)
 
        
        
    }
    
}


export async function productAdd(req,res,next){
    try {
        const files = req.body.images
        console.log(req.body)
        // const file = req.files
        const { name, description, price,stock, category, brand ,size} = req.body
        if (!files) {
            const error = new Error('Please choose files')
            error.httpStatusCode = 400;
            return next(error)
        }
        console.log(files)
// //sharp image

        
        await productModel.create({ Name:name, Description:description, Brand:brand,Price: price,Categories: category, Stock:stock,Size:size, Images: files })
            // res.send({"success":data})
            res.redirect('/admin/product_list')
      
    } catch (error) {
        console.log(error)
        next(error)
        
    }
   
}

export async function edit_product(req,res){
    try {
        const {id}=req.query;
        // console.log(req.query)
        const Categories=await categorymodel.find()
        const Category= await productModel.findById(id).populate(Categories);
        const product=await productModel.findById(id)
        res.render('admin/edit_product',{Category,product})
        
    } catch (error) {
        res.render(error)
        
    }
}

export async function delete_product(req,res){
    try {
        const {id}=req.query;
        await productModel.findByIdAndDelete(id)
        res.redirect('/admin/product_list')
        
    } catch (error) {
        res.render(error)
        
    }
}



export async function category_list(req,res){
    try {
        const category=await categorymodel.find()
        console.log(category)
        res.render('admin/category_list',{category})
        
    } catch (error) {
        res.render(error)
        
    }
}

 export const add_category = async (req, res, next) => {
    try {
    // const {category_name,category_description}= req.body 
    const category_thumbnail = req.file
    if (!category_thumbnail) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400;
        return next(error)
    }
    const { category_name, category_description } = req.body
    const category =  await categorymodel.findOne({category_name:category_name})
    console.log(category);
    if(category){
    res.send("<script>alert('Category exists'); window.location.href = '/admin/category_list'; </script>");

    }else{
    let img = fs.readFileSync(category_thumbnail.path)
    const encode_image = img.toString('base64')
    let newUpload = new categorymodel({
        category_name: category_name,
        category_description: category_description,
        category_thumbnail: category_thumbnail.originalname,
        contentType: category_thumbnail.mimetype,
        imageBase64: encode_image
    })
    return newUpload.save().then(() => {
        res.redirect('/admin/category_list')
    }).catch(error => {
        if (error) {
            if (error.name === 'mongoerror' && error.code === 11000) {
                return Promise.reject({ error: "duplicate file already exists" })
            }
            return Promise.reject({ error: "error" })
        }
    })
}
    } catch (error) {
        next(error)
    }
    
}

//User 

export async function users(req,res){
    try {
        const user=await usermodel.find()
        res.render('admin/users',{user})
        
    } catch (error) {
        next(error)
        
    }
}

export async function user_details(req,res){
    try {
        const user=await usermodel.find()
        res.render('admin/userdetails',{user})
        
    } catch (error) {
        next(error)
        
    }
}



