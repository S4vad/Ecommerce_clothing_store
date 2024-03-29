import mongoose from "mongoose";

const addProductSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    Price: {
        type: Number, // Assuming price should be a number
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    stock:{
        type:Number,
        require:true,

    },
    Image: { // Corrected spelling to "Image"
        type: String, // Assuming the image will be stored as a URL or file path
        required: true
    }
});

const Product = mongoose.model('Product', addProductSchema);

export default Product;
