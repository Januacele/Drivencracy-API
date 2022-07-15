import { Router } from "express";

import { creatChoice, addVote } from "../controllers/choiceController.js";
import { choiceValidation } from "../middlewares/choiceValidation.js";

const choiceRouter = Router();

choiceRouter.post("/choice", choiceValidation, creatChoice);
choiceRouter.post("/choice/:id/vote", addVote);


export default choiceRouter;