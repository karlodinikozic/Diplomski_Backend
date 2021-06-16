
import { Router} from "express";
import { deleteUser,readUser,updateUser,createUser } from "../controllers/userController.mjs";

import { checkIDParams,checkAccess } from "../middleware/userValidations.mjs";


export const router = Router();

//CREATE
router.post('/user',createUser)

//READ
router.get('/user/:id',checkIDParams,checkAccess,readUser)

//UPDATE
router.patch('/user/:id',checkIDParams,checkAccess,updateUser)

//DELETE
router.delete('/user/:id',checkIDParams,checkAccess,deleteUser)


