
import adminModel from "../models/adminSchema.js"

export async function adminHome(req,res){
    try {
        res.render('admin/index')
        
        
        
    } catch (error) {
        
    }


}


export function adminLoginPage(req,res){
    res.render('admin/adminLogin')
}

 export async function adminLogin(req,res){
    const {userName,password}=req.body;
    try {
        await adminModel.create({userName:userName,password:password})
        res.send("<script>alert('prodcut create succussfully');</script>")
        
    } catch (error) {
        res.send("<script>alert('product not created successully');</script>")
        
    }
    
}
