
import { Router} from "express";
import { usersOnMap } from "../controllers/mapController.mjs";
import { checkAccess } from "../middleware/userValidations.mjs";
import { findServerUrl } from '../appsupport.mjs';


export const router = Router();
const mapUrl = (req,res,next)=>{req.newUrl = findServerUrl(req,`map`,'auth/checkToken');next();}

router.get("/map",mapUrl,checkAccess,usersOnMap)