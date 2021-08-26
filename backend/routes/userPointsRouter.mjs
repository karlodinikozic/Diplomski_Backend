
import { Router} from "express";

import { checkAccess } from "../middleware/userValidations.mjs";
import { findServerUrl } from '../appsupport.mjs';
import { getUserPoints } from "../controllers/userPointsController.mjs";
import { decreaseUserPoints } from "../controllers/userPointsController.mjs";
import { addNotifications } from "../controllers/userPointsController.mjs";
import { notificationSeen } from "../controllers/userPointsController.mjs";
import { chatNotificationSeen } from "../controllers/userPointsController.mjs";
import { deleteNotification } from "../controllers/userPointsController.mjs";
import { deleteChatNotification } from "../controllers/userPointsController.mjs";
import { likeUser } from "../controllers/userPointsController.mjs";
import { dislikeUser } from "../controllers/userPointsController.mjs";
import { matchedUsers } from "../controllers/userPointsController.mjs";


export const router = Router();
const userPointsUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`userPoints`,'auth/checkToken');next();}
const userPointsDecreaseUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`userPoints/decrease`,'auth/checkToken');next();}
const userPointsaddNotificationUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`userPoints/notification`,'auth/checkToken');next();}
const userPointsaddChatNotificationUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`userPoints/chatNotification`,'auth/checkToken');next();}
const userPointsLikeUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`userPoints/like`,'auth/checkToken');next();}
const userPointsDislikeUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`userPoints/dislike`,'auth/checkToken');next();}
const userPointsMatchUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`userPoints/match`,'auth/checkToken');next();}




router.get('/userPoints',userPointsUrl,checkAccess,getUserPoints)

router.patch('/userPoints/decrease',userPointsDecreaseUrl,checkAccess,decreaseUserPoints)
router.patch('/userPoints/notification',userPointsaddNotificationUrl,checkAccess,addNotifications)

router.get('/userPoints/notification/:id',userPointsaddNotificationUrl,checkAccess,notificationSeen)
router.get('/userPoints/chatNotification/:id',userPointsaddChatNotificationUrl,checkAccess,chatNotificationSeen)

router.get('/userPoints/like/:id',userPointsLikeUrl,checkAccess,likeUser)
router.get('/userPoints/dislike/:id',userPointsDislikeUrl,checkAccess,dislikeUser)


router.get('/userPoints/match/:id',userPointsMatchUrl,checkAccess,matchedUsers)

router.delete('/userPoints/notification/:id',userPointsaddNotificationUrl,checkAccess,deleteNotification)
router.delete('/userPoints/chatNotification/:id',userPointsaddChatNotificationUrl,checkAccess,deleteChatNotification)







