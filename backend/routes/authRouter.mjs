
import { Router} from "express";
import { loginUser,getAccess } from "../controllers/authController.mjs";
import { checkForToken } from "../middleware/authValidators.mjs";

export const router = Router();

router.post('/login',loginUser);
router.post('/checkToken',checkForToken,getAccess);