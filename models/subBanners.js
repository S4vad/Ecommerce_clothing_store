import mongoose from "mongoose";



const bannerSchema=mongoose.Schema({
    bannerHead:{type:String,
        require:true
    },
    bannerInfo:{
        type:String,
        require:true
    },
    image:{
        type:String
 
    },
    Categories:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required:true,
      },
    contentType:{
        type: String
    },

    imageBase64:{
        type:String
    }

})
const subBannerModel=mongoose.model('subBanner',bannerSchema)

export default subBannerModel;