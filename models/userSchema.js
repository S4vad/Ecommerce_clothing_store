import mongoose from "mongoose"

// const { isEmail } = require('validator');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fname:{
    type:String,
    require:true,
  },
  lname:{
    type:String,
    require:true,
  },
  email:{
      type:String,
      require:true,
  },
  password:{
      type:String,
      require:true,

  }
  });


const usermodel = mongoose.model("user",userSchema )
export default usermodel;