
import { Router} from "express";
import { checkAccess } from "../middleware/userValidations.mjs";
import { saveMessage } from "../controllers/chatController.mjs";
import { createThread } from "../controllers/chatController.mjs";
import { getChatThread } from "../controllers/chatController.mjs";
import { checkChatHeader } from "../middleware/messageValidations.mjs";



export const router = Router();
const chatUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`chat`,'auth/checkToken');next();}

router.post("/get",chatUrl,checkAccess,checkChatHeader,getChatThread)
router.post("/chat",chatUrl,checkAccess,createThread)
router.patch("/chat",chatUrl,checkAccess,saveMessage)