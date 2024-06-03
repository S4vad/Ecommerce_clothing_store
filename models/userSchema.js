import mongoose from "mongoose"

// const { isEmail } = require('validator');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    require:true,


},
password:{
    type:String,
    require:true,
//for removing white space

}
}
);


const usermodel = mongoose.model("user",userSchema )
export default usermodel;