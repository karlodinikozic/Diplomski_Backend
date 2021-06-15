
import { Router} from "express";

import { checkIDParams } from "../middleware/userValidations.mjs";


export const router = Router();

//CREATE
router.post('/user')

//READ
router.get('/user/:id')

//UPDATE
router.patch('/user/:id')

//DELETE
router.delete('/user/:id',checkIDParams)