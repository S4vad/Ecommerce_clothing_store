import usermodel from "../models/userSchema.js";



export async function getUser(userId){
    
    if (!userId) 
        return false;
    try {
        const userDetails=await usermodel.findById(userId);
        console.log(userDetails,"ooooooo")
        return userDetails;
        
    } catch (error) {
        console.log(error)
        return false;
        
    }
    


};

