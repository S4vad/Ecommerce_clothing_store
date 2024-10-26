import mongoose from "mongoose";
const couponSchema = new mongoose.Schema({
  
    code:String,
    type:String,
    discount:{type:Number,trim:true},
    limit:Number,
    description:String,
    status:String,
    startDate:Date,
    endDate:Date ,
    users: [{
      userId: {
          type: mongoose.Types.ObjectId,
          ref: 'user',
      },
      isUsed: {
          type: Boolean,
          default: false
      }
  }],
    isExpired:{
      type:Boolean,
      default:false
    },

},
{
  timestamps:true,
}
);

const couponModel = mongoose.model("coupon",couponSchema )
export default couponModel;