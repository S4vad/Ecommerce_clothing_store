import path from "path";
import express from "express"
import mongoose from "mongoose"

import connectToDatabase from "./config/db_connection.js";
import { fileURLToPath } from "url";
import adminRoute from "./routes/adminRoute.js"
import morgan from "morgan";


const app=express();




connectToDatabase();

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))

const __dirname=path.dirname(fileURLToPath(import.meta.url))

const publicDirectoryPath = path.join(__dirname, "public");
app.use(express.static("public"));

app.set("views",path.join(__dirname,"views"))
app.set('view engine','ejs')

app.use("/admin",adminRoute)



const port=3000;
app.listen(port,()=>{
    console.log('server running successfully',port)
})

