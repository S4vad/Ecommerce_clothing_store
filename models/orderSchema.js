import mongoose from 'mongoose';
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const orderSchema = new mongoose.Schema({
    address:{
        name: String,
        address:String,
        city:String,
        state:String,
        zip:Number,
        phone:String,
    },
    user:{type:mongoose.Types.ObjectId,
          ref:'user'
        },
    payment:String,
    products:Array,
    totalamount:Number,
    status:String,
},
{
  timestamps:true,
}
);


const ordermodel = mongoose.model("order",orderSchema )
module.exports = ordermodel