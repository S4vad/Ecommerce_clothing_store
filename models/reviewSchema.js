const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,
    ref:'user',
    required:true
    },
    product:{type:mongoose.Types.ObjectId,
        ref:'products',
        required:true
        },
    stars:Number,
    title:String,
    review:String,

},
{
  timestamps:true,
}
);

const reviewmodel = mongoose.model("review",reviewSchema )
module.exports = reviewmodel