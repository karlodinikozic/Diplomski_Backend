
import { Router} from "express";
import { loginResponse,accessResponse } from "../controllers/authController.mjs";


export const router = Router();

router.post('/login',loginResponse);
router.get('/getAccess',accessResponse);
