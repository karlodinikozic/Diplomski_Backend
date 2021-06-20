
import { Router} from "express";
import { deleteUser,readUser,updateUser,createUser,verifyUserEmail,setActive } from "../controllers/userController.mjs";

import { checkIDParams,checkAccess } from "../middleware/userValidations.mjs";


import { findServerUrl } from '../appsupport.mjs';
export const router = Router();

const userUrl = (req,res,next)=>{
   req.newUrl = findServerUrl(req,`user`,'auth/checkToken');next();
}
const paramEQuserId = (req,res,next)=>{req.params_id=req.user_id;next()}

//CREATE
router.post('/user',createUser)

//READ
router.get('/user/:id',checkIDParams,userUrl,checkAccess,readUser)

//UPDATE
router.patch('/user',userUrl,checkAccess,paramEQuserId,setActive,updateUser)

//DELETE
router.delete('/user/:id',checkIDParams,userUrl,checkAccess,deleteUser)


//Personal Page Data
router.get('/user',userUrl,checkAccess,paramEQuserId,setActive,readUser)

//Verfiy Email
router.get('/user/verifyEmail/:token',verifyUserEmail)


// TODO Forgot password Email
//router.get('/user/forgotPassword',forgotPassword)




