import fs from "fs/promises";

import Wine from "../models/Wine.js";

import { HttpError } from "../helpers/index.js";
import { cloudinary } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";


const getAll = async (req, res) => {
    const result = await Wine.find();
    res.json(result);
};

// const getById = async (req, res) => {
//     const { id } = req.params;
//     const result = await Wine.findOne({_id: id});
//     if (!result) {
//         throw HttpError(404, `Wine with id=${id} not found`);
//     }

//     res.json(result);
// }

const add = async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    const {path: oldPath} = req.file;
    // const { fileData } = await cloudinary.uploader.upload(oldPath, {folder: "posters"});
    const { url: poster } = await cloudinary.uploader.upload(oldPath, {folder: "posters"});
    await fs.unlink(oldPath);

    const result = await Wine.create({...req.body, poster});
    res.status(201).json(result);
}



// const updateById = async (req, res) => {
//     const { id } = req.params;
//     const result = await Wine.findByIdAndUpdate(id, req.body);
//     if (!result) {
//         throw HttpError(404, `Movie with id=${id} not found`);
//     }

//     res.json(result);
// }

const deleteById = async (req, res) => {
    const { id } = req.params;
    const result = await Wine.findByIdAndDelete(id);
    if (!result) {
        throw HttpError(404, `Wine with id=${id} not found`);
    }

    res.json({
        message: "Delete success"
    })
}

export default {
    getAll: ctrlWrapper(getAll),
    add: ctrlWrapper(add),
    deleteById: ctrlWrapper(deleteById),
    // getById: ctrlWrapper(getById),
    // updateById: ctrlWrapper(updateById),
}