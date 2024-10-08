import mongoose from "mongoose";



const bannerSchema=mongoose.Schema({
    bannerName:{type:String,
        require:true
    },
    bannerInfo:{
        type:String,
        require:true
    },
    image:{
        type:String
 
    },
    contentType:{
        type: String
    },

    imageBase64:{
        type:String
    }

})
const bannerModel=mongoose.model('banner',bannerSchema)

export default bannerModel;