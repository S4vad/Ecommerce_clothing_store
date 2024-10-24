import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,
    ref:'user',
    required:true
    },
    products:[{
        item:{
            type: mongoose.Types.ObjectId, 
            ref:'Products',
            required: true, 
        },
        quantity:{
            type:Number,default:1
        }
        }],
   totalQuantity:{
    type: Number,
   },
   subtotal:{
    type: String,
   }

},
{
  timestamps:true,
}
);

const cartModel = mongoose.model("cart",cartSchema )
export default cartModel;