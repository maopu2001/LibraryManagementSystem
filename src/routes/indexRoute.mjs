import { Router } from "express";
import userRoute from "./userRoute.mjs";
import bookRoute from "./bookRoute.mjs";
import adminRoute from "./adminRoute.mjs";
import authRoute from "./authRoute.mjs";

const router = Router();

router.use(authRoute);
router.use(userRoute);
router.use(bookRoute);
router.use(adminRoute);

export default router;
