import mongoose from "mongoose";

const addProductSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },

    Price: {
        type: Number,
        required: true
    },
    Stock:{
        type:Number,
        required:true,

    },
    Images: [
        
    ],
    ImageFeatures: { 
        type: Array, 
        default: [] 
    },
    Categories:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required:true,
      },
    Brand:{
        type:String,
        required:true
    },
    Size:{
        type:String,
        required:true
    },
    




},{timestamps:true});//database time show cheyyan

const Product = mongoose.model('Products', addProductSchema);

export default Product;
