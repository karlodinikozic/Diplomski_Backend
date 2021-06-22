
import { Router} from "express";
import { checkAccess } from "../middleware/userValidations.mjs";
import { saveMessage } from "../controllers/chatController.mjs";
import { createThread } from "../controllers/chatController.mjs";



export const router = Router();
const chatUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`chat`,'auth/checkToken');next();}

router.post("/chat",chatUrl,checkAccess,createThread)
router.patch("/chat",chatUrl,checkAccess,saveMessage)