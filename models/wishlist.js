import mongoose from "mongoose";


const wishlistSchema = new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,
    ref:'user',
    required:true
    },
    products:[{
        item:{type: mongoose.Types.ObjectId,
        ref:'Products',
        required: true
     },
        }],

},
{
  timestamps:true,
}
);

const wishListModel = mongoose.model("wishlist",wishlistSchema)

export default wishListModel;