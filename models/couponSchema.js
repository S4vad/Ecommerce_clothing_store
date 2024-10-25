import mongoose from "mongoose";
const couponSchema = new mongoose.Schema({
  
    code:String,
    type:String,
    discount:{type:Number,trim:true},
    limit:Number,
    description:String,
    status:String,
    startDate:Date,
    endDate:Date,
    user:[{
      userId:{type:mongoose.Types.ObjectId,
              ref:'user',
            }
    }]
},
{
  timestamps:true,
}
);

const couponmodel = mongoose.model("coupon",couponSchema )
export default couponmodel;