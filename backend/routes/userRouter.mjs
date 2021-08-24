
import { Router} from "express";
import { deleteUser,readUser,updateUser,createUser,verifyUserEmail,setActive } from "../controllers/userController.mjs";

import { checkIDParams,checkAccess } from "../middleware/userValidations.mjs";


import { findServerUrl } from '../appsupport.mjs';
import { setUserLocation } from "../controllers/userController.mjs";
import { forgotPassword } from "../controllers/userController.mjs";
import { changePassword } from "../controllers/userController.mjs";
import { resendRegistartionEmail } from "../controllers/userController.mjs";
export const router = Router();

const userUrl = (req,res,next)=>{
   req.newUrl = findServerUrl(req,`user`,'auth/checkToken');next();
}
const userLocationUrl = (req,res,next)=>{
   req.newUrl = findServerUrl(req,`user`,'auth/checkToken');next();
}

const userFogotPasswordUrl = (req,res,next)=>{
   req.newUrl = findServerUrl(req,`user/forgotPassword`,'auth/checkToken');next();
}
const userChangePasswordUrl = (req,res,next)=>{
   req.newUrl = findServerUrl(req,`user/changePassword`,'auth/checkToken');next();
}

const resendRegistartionEmailUrl = (req,res,next)=>{
   req.newUrl = findServerUrl(req,`user/resendEmail`,'auth/checkToken');next();
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

//Set user location
router.patch('/userLocation',userLocationUrl,checkAccess,setUserLocation)

//Verfiy Email
router.get('/user/verifyEmail/:token',verifyUserEmail)


//FOROGT PASSWORD
router.post('/user/forgotPassword',userFogotPasswordUrl,forgotPassword)

//UPDATE PASSWORD
router.patch('/user/changePassword',userChangePasswordUrl,checkAccess,changePassword)


//FOROGT PASSWORD
router.post('/user/resendEmail',resendRegistartionEmailUrl,resendRegistartionEmail)


