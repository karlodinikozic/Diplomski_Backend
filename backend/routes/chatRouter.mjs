
import { Router} from "express";
import { checkAccess } from "../middleware/userValidations.mjs";
import { saveMessage } from "../controllers/chatController.mjs";
import { createThread } from "../controllers/chatController.mjs";
import { getChatThread } from "../controllers/chatController.mjs";
import { checkChatHeader } from "../middleware/messageValidations.mjs";
import { findServerUrl } from '../appsupport.mjs';
import { getUserChats } from "../controllers/chatController.mjs";
import { blockChat } from "../controllers/chatController.mjs";



export const router = Router();
const chatUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`chat`,'auth/checkToken');next();}
const userChatUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`userChats`,'auth/checkToken');next();}
const blockChatUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`blockChat`,'auth/checkToken');next();}

router.get("/chat",chatUrl,checkAccess,checkChatHeader,getChatThread)
router.post("/chat",chatUrl,checkAccess,createThread)
router.patch("/chat",chatUrl,checkAccess,saveMessage)
router.patch("/blockChat",blockChatUrl,checkAccess,blockChat)
router.get("/userChats",userChatUrl,checkAccess,getUserChats)

