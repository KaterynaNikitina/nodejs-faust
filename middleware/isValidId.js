import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/index.js";

const isValidId = (req, res, next) => {
  const { wineId } = req.params;
  if (!isValidObjectId(wineId)) {
    return next(HttpError(404, `${wineId} is not valid id`));
  }
  next();
};

export default isValidId;