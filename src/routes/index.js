import { Router } from "express";

import pollRouter from "./pollRouter.js";
import choiceRouter from "./choiceRouter.js";

const router = Router();

router.use(pollRouter);
router.use(choiceRouter);

export default router;