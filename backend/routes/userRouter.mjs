
import { Router} from "express";
import { deleteUser,readUser,updateUser,createUser,verifyUserEmail,setActive } from "../controllers/userController.mjs";

import { checkIDParams,checkAccess } from "../middleware/userValidations.mjs";


export const router = Router();

//CREATE
router.post('/user',createUser)

//READ
router.get('/user/:id',checkIDParams,checkAccess,readUser)

//UPDATE
router.patch('/user',checkAccess,(req,res,next)=>{req.params_id=req.user_id;next()},setActive,updateUser)

//DELETE
router.delete('/user/:id',checkIDParams,checkAccess,deleteUser)


//Personal Page Data
router.get('/user',checkAccess,(req,res,next)=>{req.params_id=req.user_id;next()},setActive,readUser)

//Verfiy Email
router.get('/user/verifyEmail/:token',verifyUserEmail)


// TODO Forgot password Email
//router.get('/user/forgotPassword',forgotPassword)


