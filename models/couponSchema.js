const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
  
    code:String,
    type:String,
    discount:{type:Number,trim:true},
    limit:Number,
    description:String,
    status:String,
    startDate:Date,
    endDate:Date,
},
{
  timestamps:true,
}
);

const couponmodel = mongoose.model("coupon",couponSchema )
module.exports = couponmodel