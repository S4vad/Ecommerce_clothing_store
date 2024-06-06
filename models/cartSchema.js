import mongoose from "mongoose";
const cartSchema=mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Product'

    },
    quantity:{
        type:Number,
        require:true

    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'user'
        
    }

})

const cartModel=mongoose.model('cart',cartSchema)
export default cartModel;