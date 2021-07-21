
import { Router} from "express";

import { checkAccess } from "../middleware/userValidations.mjs";
import { findServerUrl } from '../appsupport.mjs';
import { getUserPoints } from "../controllers/userPointsController.mjs";
import { decreaseUserPoints } from "../controllers/userPointsController.mjs";
import { addNotifications } from "../controllers/userPointsController.mjs";


export const router = Router();
const userPointsUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`userPoints`,'auth/checkToken');next();}
const userPointsDecreaseUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`userPoints/decrease`,'auth/checkToken');next();}
const userPointsaddNotificationUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`userPoints/notification`,'auth/checkToken');next();}




router.get('/userPoints',userPointsUrl,checkAccess,getUserPoints)
router.patch('/userPoints/decrease',userPointsDecreaseUrl,checkAccess,decreaseUserPoints)
router.patch('/userPoints/notification',userPointsaddNotificationUrl,checkAccess,addNotifications)







