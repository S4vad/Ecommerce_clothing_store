import jwt from "jsonwebtoken";
import adminModel from "../models/adminSchema.js"
import productModel from "../models/productSchema.js"
import usermodel from "../models/userSchema.js";
import bcrypt from "bcrypt";
import categorymodel from "../models/categorySchema.js";
import bannerModel from "../models/bannerSchema.js";
import fs from "fs";
import subBannerModel from "../models/subBanners.js";
import couponModel from "../models/couponSchema.js"
import orderModel from "../models/orderSchema.js";
import reviewModel from "../models/reviewSchema.js";
import moment from "moment";



export async function adminHome(req,res){
    
        const orders = await orderModel.find().populate('products.item').populate('user');

        const reviews = await reviewModel.find().populate('user').populate('product');

        const totalUsers = await usermodel.countDocuments();

        const { totalAmount, totalOrders } = orders.reduce((acc, order) => {
            acc.totalAmount += (order.totalamount || 0); 
            acc.totalOrders += 1; 
            return acc;
        }, { totalAmount: 0, totalOrders: 0 });
        const averageOrderValue=Math.floor(totalAmount/totalOrders)



        const productQuantities = {};

        orders.forEach(order => {
            order.products.forEach(product => {
                const productId = product.item._id.toString();
                if (!productQuantities[productId]) {
                    productQuantities[productId] = {
                        productId: productId,
                        name: product.item.Name,
                        price: product.item.Price,
                        totalQuantity: 0,
                        totalRevenue: 0
                    };
                }

                productQuantities[productId].totalQuantity += product.quantity;
                productQuantities[productId].totalRevenue += product.quantity * product.item.Price;
            });
        });

        const topProducts = Object.values(productQuantities)
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, 5); 


        console.log('the top 5 products are',topProducts)


        const monthlyIncome = Array(12).fill(0); // Initialize array for 12 months
        orders.forEach(order => {
            const monthIndex = new Date(order.invoiceDate).getMonth(); // Get month as 0-11
            monthlyIncome[monthIndex] += order.totalamount || 0; // Sum the totalamount for each month
        });

        // format monthly data
        const incomeData = monthlyIncome.map((income, index) => ({
            label: new Date(0, index).toLocaleString("default", { month: "short" }),
            value: income
        }));

        console.log('incodme data',incomeData)

        res.locals.moment = moment; 

        res.render('admin/index',{
            totalAmount:Math.floor(totalAmount),
            totalOrders,
            averageOrderValue,
            totalUsers,
            topProducts,
            incomeData,
            orders,
            reviews
        })
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
        res.send(error.message)
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
        res.send("<script>alert('sign in not successed');</script>")

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
        const images = req.body.images
        // const file = req.files
        const { name, description, price,stock, category, brand ,size} = req.body
        if (!images) {
            const error = new Error('Please choose files')
            error.httpStatusCode = 400;
            return next(error)
        }

        // Extract features for each image (adjust if calling an external Python script or service)
        const imageFeatures = await Promise.all(
            images.map(filename => extractFeatures(`./public/uploads/${filename}`))
        );

        //sharp image
        await productModel.create({ 
            Name:name, 
            Description:description,
             Brand:brand,
             Price: price,
             Categories: category, 
             Stock:stock,
             Size:size, 
             Images: files,
             ImageFeatures: imageFeatures  })
            // res.send({"success":data})
            res.redirect('/admin/product_list')
      
    } catch (error) {
        console.log(error)
        next(error)
        
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

export async function edit_product(req,res){
    try {
        const {id}=req.query;
        // console.log(req.query)
        const Category=await categorymodel.find();
        const product= await productModel.findById(id).populate("Categories");
        product.Images=product.Images || []     // product.product_image=product.product_image || []
    
        res.render('admin/edit_product',{product,Category})//   C capital aan
        
    } catch (error) {
        // res.render(error)
        console.log(error)
        
    }
}


export async function edit_single_product(req, res) {
    try {
        const { id } = req.body;
        const updatedProductData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
            // Handle images separately if needed
        };

        // Handle images upload logic here if needed

        await productModel.findByIdAndUpdate(id, updatedProductData);
        res.redirect('/admin/product_list'); // Redirect to product list or desired page
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
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


export async function delete_category(req,res) {
    try {
        const id=req.query.id;
        await categorymodel.findByIdAndDelete(id)
        res.redirect('/admin/category_list')
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function edit_category(req, res) {
    try {
        const  id  = req.query.id;
        let img = fs.readFileSync(category_thumbnail.path)
        const encode_image = img.toString('base64')
        const category_thumbnail = req.file
        
        const updatedProductData = {
            category_name: req.body.category_name,
            category_description: req.body.category_description,
            category_thumbnail: req.body.category_thumbnail,
            contentType: category_thumbnail.mimetype,
            imageBase64: encode_image

            // Handle images separately if needed
        };
        

        // Handle images upload logic here if needed

        await categorymodel.findByIdAndUpdate({_id:id}, updatedProductData);
        res.redirect('/admin/category_list'); // Redirect to product list or desired page
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
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



export async function addBanner(req,res) {
    try {
        res.render('admin/banner')
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}


export async function banner(req,res) {
    try {
        const banner_image = req.file;
       
        const bannerName=req.body.bannerName;
        const bannerInfo=req.body.bannerInfo;
        let img = fs.readFileSync(banner_image.path)
        const encode_image = img.toString('base64')
        bannerModel.create({
            bannerName:bannerName,
            bannerInfo:bannerInfo,
            image:banner_image.filename,
            imageBase64:encode_image,
            contentType: banner_image.mimetype,

        })
        res.redirect('/admin/bannerList')


        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function bannerList(req,res) {

    try {

        const banner=await bannerModel.find()
        res.render('admin/bannerList',{banner:banner})
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function editBanner(req,res) {
    try {

        

        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function deleteBanner(req,res) {

    try {

        const id=req.query.id;

        await bannerModel.findByIdAndDelete(id)
        res.redirect('/admin/bannerList')
        
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}


//subBanner


export async function addSubBanner(req,res) {
    try {
        const category=await categorymodel.find()
        res.render('admin/subBanner',{category:category})
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

//post function

export async function subBanner(req,res) {
    try {
        const banner_image = req.file;
        
       
        const bannerHead=req.body.bannerHead;
        const bannerInfo=req.body.bannerInfo;
        const category=req.body.category;
        let img = fs.readFileSync(banner_image.path)
        const encode_image = img.toString('base64')
        subBannerModel.create({
            bannerHead:bannerHead,
            bannerInfo:bannerInfo,
            image:banner_image.filename,
            imageBase64:encode_image,
            contentType: banner_image.mimetype,
            Categories:category

        })
        res.redirect('/admin/subBannerList')


        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function subBannerList(req,res) {

    try {

        const banner=await subBannerModel.find().populate('Categories')
        console.log(banner)
        res.render('admin/subBannerList',{banner:banner})
    } catch (error) {
    res.send(error.message)
        
    }
    
}




export async function editSubBanner(req,res) {
    try {

        

        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function deleteSubBanner(req,res) {

    try {

        const id=req.query.id;

        await subBannerModel.findByIdAndDelete(id)
        res.redirect('/admin/subBannerList')
        
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}


export function coupon(req,res){

    try {
        res.render('admin/coupon')
        
    } catch (error) {
        res.send(error.message)
        
    }

}

export  async function addCoupon(req,res){

    try {

        // const {code,type,discount,limit,description,status,startDate,endDate}=req.body
        const data={...req.body}


        await couponModel.create(data)
        res.redirect('/admin/couponList')
        
    } catch (error) {
        res.send(error.message)
        
    }
    
}

export async function couponList(req,res){
    try {

        const coupon=await couponModel.find()
        res.locals.coupon = coupon || null //sharing localy
        res.locals.moment = moment

        res.render('admin/couponList')
        
    } catch (error) {
        res.send(error.message)
    }
}

export async function editCoupon(req,res){
    try {
        const id=req.query.id;
        const coupon=await couponModel.find({_id:id});

        res.locals.coupon=coupon || null;
        res.locals.moment=moment;

        res.render('admin/couponEdit',{id:id})
        
    } catch (error) {
        res.send(error.message)
    }
}

export async function updateCouponStatus(req, res) {
    try {
        const id = req.query.id;
        const status = req.query.status ;
        
        await couponModel.findByIdAndUpdate(id, { status: status });

        const coupon = await couponModel.find();
        res.locals.moment = moment


        res.render('admin/couponList', { coupon });
    } catch (error) {
        res.send(error.message);
    }
}

export async function editCouponPost(req, res) {
    try {
        const id = req.query.id;
        const data = req.body; 
        
        console.log('The coupon id:', id);
        console.log('Updated data:', data);
        
        await couponModel.findByIdAndUpdate(id, data);
        
        res.redirect('/admin/couponList');
    } catch (error) {
        res.send(error.message);
    }
}



export async function deleteCoupon(req,res){
    try {
        const id=req.query.id;
        await couponModel.findByIdAndDelete(id)

        const coupon=await couponModel.find()
        res.render('admin/couponList',{coupon,moment})


        
    } catch (error) {
        res.send(error.message)
    }
}


export async function customersList(req,res){
    try {
        const user=await usermodel.find()


        res.render('admin/customersList',{user:user})

    } catch (error) {
        res.send(error.message)
    }
}


export async function editIsActive(req, res) {
    try {
        const id = req.query.id;
        const status = req.query.status === "Active"; 
        
        await usermodel.findByIdAndUpdate(id, { isActive: status });

        const user = await usermodel.find();
        res.render('admin/customersList', { user });
    } catch (error) {
        res.send(error.message);
    }
}

export async function reviewList(req, res) {
    try {
     
        const reviews = await reviewModel.find()
            .sort({ createdAt: -1 })  
            .populate('user', 'fname lname email profilePic') 
            .populate('product', 'Name Images')  
            .select('rating review user createdAt product');  

        if (!reviews || reviews.length === 0) {
            return res.render('admin/reviewList', { reviews: [] });  
        }

        // Render the review list page, passing reviews
        res.render('admin/reviewList', { reviews });
    } catch (error) {
        console.error("Error in fetching reviews:", error);
        res.status(500).send('Server error: ' + error.message);  
    }
};

export async function orderList(req,res) {
    try {
        const order = await orderModel.find().populate('user')
        console.log('the order is',order)
        res.locals.moment=moment;
        res.render('admin/orderList',{order})

    } catch (error) {
        res.send(error.message)
        
    }
    
}










