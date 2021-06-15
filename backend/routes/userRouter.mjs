
import { Router} from "express";
import { deleteUser,readUser } from "../controllers/userController.mjs";

import { checkIDParams,checkAccess } from "../middleware/userValidations.mjs";


export const router = Router();

//CREATE
router.post('/user')

//READ
router.get('/user/:id',checkIDParams,checkAccess,readUser)

//UPDATE
router.patch('/user/:id')

//DELETE
router.delete('/user/:id',checkIDParams,checkAccess,deleteUser)


