import multer from "multer";
import path from "path";

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/productuploads/')
    },
    filename: (req, file, cb)=>{ 
        var ext=file.originalname.substring(file.originalname.lastIndexOf('.'))    
      cb(null,file.fieldname+"-"+Date.now()+ ext)  
    }
  })
let store = multer({storage:storage})
//if multiple imag specify array  eg: .array('category_thumbnail',3)
  //group end
export default store;

  