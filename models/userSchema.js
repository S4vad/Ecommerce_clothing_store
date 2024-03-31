import mongoose from "mongoose"

// const { isEmail } = require('validator');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstname:{type: String, required: true, trim:true},
    lastname:{type: String,required: true, trim:true},
    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim:true,
  },
  phone:{
    type: String,
  },
  password: {
    type: String,
    trim:true,
    required: true,
    minlength: [6],
  },
  isBanned:{type:Boolean, default:false},
  
 
},
{
  timestamps:true,
}
);


const usermodel = mongoose.model("user",userSchema )
export default usermodel;