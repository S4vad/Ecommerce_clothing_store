import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products", // Assuming you have a "Product" model that contains item details
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

// Main order schema
const orderSchema = new mongoose.Schema({
    address: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "address"
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    payment: String,
    products: [productSchema],  // Use productSchema here to structure each product in the array
    totalamount: Number,
    status: String,
    paymentMethod: {
        type: String,
        required: true
    },
    invoiceNumber: {
        type: Number,
    },
    invoiceDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date
    }
}, {
    timestamps: true
});

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
