import express from "express";

import winesController from '../../controllers/wines-controller.js';
// import   authenticate   from "../../middleware/authenticate.js";

import * as wineSchema from "../../models/Wine.js"

import {validateBody} from '../../decorators/index.js';
// import {isValidId} from "../../middlewares/index.js";

const wineAddValidate = validateBody(wineSchema.wineAddSchema);
// const wineUpdateValidate = validateBody(wineSchema.wineUpdateSchema);


const winesRouter = express.Router();

// winesRouter.use(authenticate);

winesRouter.get("/", winesController.getAll);

// winesRouter.get("/:wineId", isValidId, winesController.getById);

winesRouter.post("/", wineAddValidate, winesController.add);

// winesRouter.put("/:contactId", isValidId, wineUpdateValidate, winesController.updateById);

// winesRouter.delete("/:contactId", isValidId, winesController.deleteById);

export default winesRouter;
