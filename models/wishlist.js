import mongoose from "mongoose";

const wishlist=mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Products'

    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'user'
        
    },


})

const wishlistModel=mongoose.model('wishlist',wishlist)
export default wishlistModel;