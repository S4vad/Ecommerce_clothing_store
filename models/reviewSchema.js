import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,
    ref:'user',
    required:true
    },
    product:{type:mongoose.Types.ObjectId,
        ref:'Products',
        required:true
        },
    rating:Number,
    review:String,
    name:String,
    email:String,

},
{
  timestamps:true,
}
);

const reviewModel = mongoose.model("review",reviewSchema )
export default reviewModel;