import express from "express";

import winesController from '../../controllers/wines-controller.js';
import   { upload }   from "../../middleware/index.js";

import * as wineSchema from "../../models/Wine.js";

import {validateBody} from '../../decorators/index.js';
// import {isValidId} from "../../middlewares/index.js";
// import   { authenticate }   from "../../middleware/index.js";

const wineAddValidate = validateBody(wineSchema.wineAddSchema);
// const wineUpdateValidate = validateBody(wineSchema.wineUpdateSchema);


const winesRouter = express.Router();

// winesRouter.use(authenticate);

winesRouter.get("/", winesController.getAll);

// winesRouter.get("/:wineId", isValidId, winesController.getById);

winesRouter.post("/", upload.single("poster"), wineAddValidate, winesController.add);

// winesRouter.put("/:contactId", isValidId, wineUpdateValidate, winesController.updateById);

// winesRouter.delete("/:contactId", isValidId, winesController.deleteById);

export default winesRouter;