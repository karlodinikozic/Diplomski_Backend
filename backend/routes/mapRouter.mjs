
import { Router} from "express";
import { usersOnMap,filterUsersOnMap } from "../controllers/mapController.mjs";
import { checkAccess } from "../middleware/userValidations.mjs";
import { findServerUrl } from '../appsupport.mjs';
import { findSomeOne } from "../controllers/mapController.mjs";


export const router = Router();
const mapUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`map`,'auth/checkToken');next();}
const findSomeoneUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`findSomeone`,'auth/checkToken');next();}

router.get("/map",mapUrl,checkAccess,usersOnMap)
router.post("/map",mapUrl,checkAccess,filterUsersOnMap)
router.post("/findSomeone",findSomeoneUrl,checkAccess,findSomeOne)