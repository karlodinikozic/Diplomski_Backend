
import { Router} from "express";
import { loginUser } from "../controllers/authController.mjs";

export const router = Router();

router.post('/login',loginUser);