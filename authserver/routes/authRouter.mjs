
import { Router} from "express";
import { loginUser,getAccess,checkAccessToken } from "../controllers/authController.mjs";
import { checkForToken } from "../middleware/authValidators.mjs";

export const router = Router();

router.post('/login',loginUser);
router.get('/getAccess',checkForToken,getAccess);
router.get('/checkToken',checkForToken,checkAccessToken);