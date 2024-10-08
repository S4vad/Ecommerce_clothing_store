import mongoose from "mongoose";

const cartSchema=mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Products'

    },
    quantity:{
        type:Number,
        require:true

    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'user'
        
    },
    size:{
        type:String,
        require:true
    }


})

const cartModel=mongoose.model('cart',cartSchema)
export default cartModel;