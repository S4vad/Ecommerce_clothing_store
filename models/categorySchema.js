import { mongoose } from 'mongoose';


const categorySchema = new mongoose.Schema({
    category_name:{type: String, required: true, trim:true},
    category_description:{type: String},
    product_count: {type: Number},
  category_thumbnail:{type: String},
  contentType:{type: String},
  imageBase64:{type:String}.type
 
},
{
  timestamps:true,
}
);

const categorymodel = mongoose.model("Categories",categorySchema )
export default categorymodel;