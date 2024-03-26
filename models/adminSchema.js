import mongooose from "mongoose";

const adminSchema=mongooose.Schema({
    userName:{
        type:String,
        require:true,
        unique:true,
        trim:true

    },
    password:{
        type:String,
        require:true,
        minlength:[6],
        trim:true //for removing white space

    }

})

const adminModel=mongooose.model('admin',adminSchema)

export default adminModel;