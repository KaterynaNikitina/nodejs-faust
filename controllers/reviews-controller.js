import { Review } from "../models/Review.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpsError from "../helpers/HttpError.js";

const getAllReviews = async (req, res) => {
  const result = await Review.find()
    .populate("owner", "username")
    .exec();
  res.status(200).json(result);

};

const getOwnReview = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Review.find({ owner })
  // .populate("owner", "_id userName")
  // .exec();
  if (!result) {
    throw HttpsError(404, "Not found");
  }

  res.status(200).json(result);
};



const addReview = async (req, res) => {

  const { _id: owner } = req.user;

  const result = await Review.create({ ...req.body, owner });
  res.status(201).json(result);
  
};
 
const updateReview = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Review.findOneAndUpdate({owner}, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpsError(404, "Not found");
  }
  res.status(200).json(result);

};

const deleteReview = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Review.findOneAndDelete({ owner });
  if (!result) {
    throw HttpsError(404, "Not found");
  }
  res.status(200).json({
    message: "Delete success",
  });
};

export default {
  getAllReviews: ctrlWrapper(getAllReviews),
  getOwnReview: ctrlWrapper(getOwnReview),
  addReview: ctrlWrapper(addReview),
  updateReview: ctrlWrapper(updateReview),
  deleteReview: ctrlWrapper(deleteReview),
};