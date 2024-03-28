import mongooose from "mongoose";

const adminSchema=new mongooose.Schema({
    userName:{
        type:String,
        require:true,


    },
    password:{
        type:String,
        require:true,
//for removing white space

    }

})

const adminModel=mongooose.model('admin',adminSchema)

export default adminModel;