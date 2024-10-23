import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,
    ref:'user',
    required:true
    },
    address:[
        {
          name:{
            type: String
          },
          address:{
            type: String
          },
          city:{
            type: String
          },
          state:{
            type: String
          },
          zip:{
            type:Number
          },
          phone:{
            type: String
          },
          email:{
            type: String
          }
        }
      ]
 

},
{
  timestamps:true,
}
);

const addressModel = mongoose.model("address",addressSchema )
export default addressModel;