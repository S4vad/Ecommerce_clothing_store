import { mongoose } from 'mongoose';
// import { isEmail } from 'validator';
// import bcrypt from bcrypt;

const categorySchema = mongoose.Schema({
    userId:{type: String, required: true, trim:true},
    email:{type: String},
    message:{type: String},

 
},
{
  timestamps:true,
}
);

const contactModel = mongoose.model("contact",categorySchema )
export default contactModel;