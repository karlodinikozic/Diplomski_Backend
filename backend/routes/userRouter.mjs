
import { Router} from "express";
import { deleteUser,readUser,updateUser,createUser } from "../controllers/userController.mjs";

import { checkIDParams,checkAccess } from "../middleware/userValidations.mjs";


export const router = Router();

//CREATE
router.post('/user',createUser)

//READ
router.get('/user/:id',checkIDParams,checkAccess,readUser)

//UPDATE
router.patch('/user',checkAccess,(req,res,next)=>{req.params_id=req.user_id;next()},updateUser)

//DELETE
router.delete('/user/:id',checkIDParams,checkAccess,deleteUser)


//Personal Page Data
router.get('/user',checkAccess,(req,res,next)=>{req.params_id=req.user_id;next()},readUser)


