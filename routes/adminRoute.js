import express, { Router } from "express";
import { adminHome } from "../controller/admincontroller.js";



const routes=express.Router();

routes.use(express.static("public"))

routes.get('/',adminHome)

export default routes;