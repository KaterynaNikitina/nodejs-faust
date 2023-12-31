import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const wineSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name'],
      },
      country: {
        type: String,
        required: [true, 'Set country'],
      },
      volume: {
        type: String,
        required: [true, 'Set volume'],
      },
      price: {
        type: Number,
        required: [true, 'Set price'],
      },
      poster: {
        type: String,
        required: true,
    },
}, {versionKey: false})

wineSchema.post("save", handleSaveError);

wineSchema.pre("findOneAndUpdate", runValidateAtUpdate);

wineSchema.post("findOneAndUpdate", handleSaveError);

export const wineAddSchema = Joi.object({
    name: Joi.string().required().messages({ "any.required": "Enter name" }),
    country: Joi.string().required().messages({ "any.required": "Enter country" }),
    volume: Joi.string().required().messages({ "any.required": "Enter volume" }),
    price: Joi.number().required().messages({ "any.required": "Enter price" }),
    poster: Joi.string(),

  });
  
  export const wineUpdateSchema = Joi.object({
    name: Joi.string(),
    country: Joi.string(),
    volume: Joi.string(),
    price: Joi.number(),
    poster: Joi.string(),
  });


const Wine = model("wine", wineSchema);

export default Wine;