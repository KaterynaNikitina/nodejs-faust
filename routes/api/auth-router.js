import express from "express";
import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";
import * as userSchemas from "../../models/User.js";
import { authenticate } from "../../middleware/index.js";
// import { upload } from "../../middlewares/index.js";

const authRouter = express.Router();

const userRegisterValidate = validateBody(userSchemas.userRegisterSchema);
const userSigninValidate = validateBody(userSchemas.userLoginSchema);
const userEmailValidate = validateBody(userSchemas.userEmailSchema);
 

authRouter.post("/register", userRegisterValidate, authController.register);

authRouter.get("/verify/:verificationCode", authController.verify);

authRouter.post("/verify", userEmailValidate, authController.resendVerifyEmail);

authRouter.post("/login", userSigninValidate, authController.login);

authRouter.get("/users/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);


export default authRouter;
 
  