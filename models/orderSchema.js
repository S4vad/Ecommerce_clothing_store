import mongoose from 'mongoose';


const orderSchema = new mongoose.Schema({
    address:{ type:mongoose.Schema.Types.ObjectId,
      require:true,
      ref:"address"

    },
    user:{type:mongoose.Types.ObjectId,
          ref:'user'
        },
    payment:String,
    products:Array,
    totalamount:Number,
    status:String,
    paymentMethod: {
      type: String,
      required: true
  },
  invoiceNumber:{
    type:Number,

  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
      type: Date
  },
},
{
  timestamps:true,
}
);


const orderModel = mongoose.model("order",orderSchema );
export default orderModel;






