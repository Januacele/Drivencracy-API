import { Router } from "express";

import {
    creatPoll,
  getPoll,
  getPollChoice,
  getPollResult,
} from "../controllers/pollController.js";

import { pollValidation } from "../middlewares/pollValidation.js";

const pollRouter = Router();

pollRouter.post("/poll", pollValidation, creatPoll);
pollRouter.get("/poll", getPoll);
pollRouter.get("/poll/:id/choice", getPollChoice);
pollRouter.get("/poll/:id/result", getPollResult);

export default pollRouter;