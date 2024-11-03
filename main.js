import path from "path";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import connectToDatabase from "./config/db_connection.js";
import { fileURLToPath } from "url";
import adminRoute from "./routes/adminRoute.js"
import userRoute from "./routes/userRoute.js"
import morgan from "morgan";
import cookieParser from "cookie-parser";
// import multer from "multer";




const app=express();
app.use(bodyParser.urlencoded({ extended: true }));




connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(morgan("short"))

const __dirname=path.dirname(fileURLToPath(import.meta.url))

// const publicUserDirectoryPath = path.join(__dirname, "public");
app.use(express.static("public"));


app.use(cookieParser());//routente top l vilikkanam


// view engin setup
app.set("views",path.join(__dirname,"views"))
app.set('view engine','ejs')

// app.engine('hbs',hbs(extname)

app.use("/admin",adminRoute);
app.use('/',userRoute);



const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('server running successfully',port)
})



  //error handler
  // app.use(function (err, req, res, next) {
  //   // set locals, only providing error in development
  //   res.locals.message = err.message;
  //   res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  //   // render the error page
  //   res.status(err.status || 500);
  //   res.render('errors/404');
  // });


