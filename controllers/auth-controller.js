import User from "../models/User.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import path from "path";
// import fs from "fs/promises";
// import jimp from "jimp";
import { nanoid } from "nanoid";

import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import "dotenv/config";

const { JWT_SECRET, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();

  const newUser = await User.create({ ...req.body, password: hashPassword, verificationCode });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      username: newUser.username,
      email: newUser.email,
      verificationCode: newUser.verificationCode,
    },
  });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });

if (!user) {
  throw HttpError(404, "User not found") ;   
}
await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: "" });
res.json({
  message: "Email successfully verified ",
})
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({email});
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  if (user.verify) {
    throw HttpError(400, "Email already verified")
  }
  const verifyEmail = {
    to: email,
    subject:"Verify Email" ,
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click to verify email</a>`
  };
  await sendEmail(verifyEmail);
  res.json({
    message: 'Verification email resent',
  })
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if(!user.verify) {
    throw HttpError(401,"Please Verify your email")
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });

  res.status(200).json({
    token, 
    user,
  });
};

const getCurrent = (req, res) => {
  const { username, email } = req.user;

  res.json({
    username,
    email,
    
  });
};

// const avatarDir = path.resolve("public", "avatars")

// const updateAvatar = async (req, res) => {
//   const { _id } = req.user;

//   console.log('req.body :>> ', req.body);
//   console.log('req.file :>> ', req.file);
  
//   const { path: tempUpload, originalname } = req.file;
//   const filename = `${_id}_${originalname}`;
// //   const resultUpload = path.join(avatarDir, filename);

//   await jimp
//   .read(tempUpload)
//   .then(avatar => avatar.resize(250, 250).write(tempUpload))
//   .catch(err => console.error(err));

//   await fs.rename(tempUpload, resultUpload);
//   const avatarURL = path.join("avatars", filename);

//   await User.findByIdAndUpdate(_id, { avatarURL });

//   res.status(200).json({ avatarURL });
// }

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
//   updateAvatar: ctrlWrapper(updateAvatar)
};

// Line 31 - after deploy instead of localhost (in BASE_URL) to put 
// a real address of backend