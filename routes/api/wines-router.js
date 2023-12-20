import express from "express";

import winesController from '../../controllers/wines-controller.js';
import   { upload }   from "../../middlewares/index.js";

import * as wineSchema from "../../models/Wine.js";

import {validateBody} from '../../decorators/index.js';
import { isValidId } from "../../middlewares/index.js";
import   { authenticate }   from "../../middlewares/index.js";

const wineAddValidate = validateBody(wineSchema.wineAddSchema);
const wineUpdateValidate = validateBody(wineSchema.wineUpdateSchema);


const winesRouter = express.Router();

winesRouter.use(authenticate);

winesRouter.get("/", winesController.getAll);

winesRouter.post("/", upload.single("poster"), wineAddValidate, winesController.add);

winesRouter.put("/:wineId", isValidId, wineUpdateValidate, winesController.updateById);
 
winesRouter.delete("/:wineId", isValidId, winesController.deleteById);

export default winesRouter;
