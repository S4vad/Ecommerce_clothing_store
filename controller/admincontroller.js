import jwt from "jsonwebtoken";
import adminModel from "../models/adminSchema.js"
import productModel from "../models/productSchema.js"
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import exp from "constants";
import categorymodel from "../models/categorySchema.js";


export async function adminHome(req,res){
        res.render('admin/index')
}
    


export function adminLoginPage(req,res){
    res.render('admin/adminLogin',{message:""})
}

export function adminSignupPage(req,res){
    res.render('admin/adminRegister')
}

export function addProduct(req,res){
    res.render('admin/addProduct')
}

export async function product_list(req,res){
    try {
        const products= await productModel.find()
        // console.log(products)
        res.render('admin/product_list',{products})
        
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
        // const file = req.files
        const { name, description, price,stock, categories, brand ,size} = req.body
        if (!files) {
            const error = new Error('Please choose files')
            error.httpStatusCode = 400;
            return next(error)
        }
        console.log(files)
// //sharp image
//         let imgArray = files.map((file) => {
//             let img = fs.readFileSync('./public/productuploads/'+file)
//             return encode_image = img.toString('base64')
//         })
//         let result = imgArray.map((src, index) => {
//             let finalimg = {
//                 imageName: file[index].originalname,
//                 contentType: file[index].mimetype,
//                 imageBase64: src
//             }
//             return finalimg;
//         })
//        //delete image
//             files.forEach((el, i) => {
//             fs.rmSync('./public/productuploads/'+el, {
               
//             })
//         })
        
        await productModel.create({ Name:name, Description:description, Brand:brand,Price: price,Categories: categories, Stock:stock,Size:size, Images: files })
            // res.send({"success":data})
            res.redirect('/admin/product_list')
      
    } catch (error) {
        console.log(error)
        next(error)
        
    }
   
}

    // try {
    //     let {name,category,price,description}=req.body;
    //     console.log(req.body)
    

    //     let sampleFile = req.files.image;
    //     const __dirname = path.resolve();

    //     let random_number=Date.now()
    //     let uploadDirectory = path.join(__dirname, 'public', 'uploads');

    //     let uploadPath = path.join(uploadDirectory, random_number + '.jpg');
    //     sampleFile.mv(uploadPath, async function(err) {
    //       if (err) {
    //         return res.status(500).send(err);
        
    //       }
    //       let uploadPathRelative = path.relative(path.join(__dirname, 'public'), uploadPath);
    //       console.log(uploadPathRelative)

    //       await product.create({Name: name, Category: category, Price: price, Description: description, Image: uploadPathRelative});
    //       res.send("<script>alert('product created successfully')</script>")
    //     //   res.redirect('/')
    //     });
      

//     } catch (err) {
//         console.log(err)

        
//     }
//     // console.log(req.body)
//     // console.log(req.files.image)

// }


export async function category_list(req,res){
    try {
        const category=categorymodel.find()
        console.log(category)
        res.render('admin/category_list',{category})
        
    } catch (error) {
        res.render(error)
        
    }
}
export const add_category = async (req, res, next) => {
    try {
        const { category_name, category_description } = req.body;
        if (!category_name || !category_description) {
            const error = new Error('Category name and description are required');
            error.httpStatusCode = 400;
            return next(error);
        }

        // Create category using provided data
        await categorymodel.create({
            category_name: category_name,
            category_description: category_description,
        });

        // Redirect after successfully adding the category
        res.redirect('/admin/category_list');
    } catch (error) {
        next(error);
    }
};
