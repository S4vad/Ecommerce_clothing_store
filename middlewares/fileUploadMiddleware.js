import multer from "multer";
import path from "path";

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{cb(null,'./public/uploads/')},
    filename: (req, file, cb)=>{     
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))  
    }
  })



export default multer({storage:storage});
//import uploadFile from "../middleware/fileUploadMiddleware.js"
//if multiple imag specify array  eg: uploadFile.array('category_thumbnail',3) 
//category_tumbnail is file name starting
//if single image  eg: uploadFile.single('category_thumbnail')

  