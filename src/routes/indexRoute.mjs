import { Router } from "express";
import userRoute from "./userRoute.mjs";
import bookRoute from "./bookRoute.mjs";

const router = Router();

router.use(userRoute);
router.use(bookRoute);

export default router;
