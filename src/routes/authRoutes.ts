import { createValidator } from "express-joi-validation";
import { App_url } from "../common/constant";
import Joi from "joi";
import express from "express";
import authControllers from "../controller/auth/authControllers";
import verifyToken from "../middleware/auth";
import getUserDetails from "../controller/auth/getUserDetails";
import createChatGroup from "../controller/chatGroup/createChatGroup";

const router  = express.Router();
const validator = createValidator({});

const registerSchema = Joi.object({
    username:Joi.string().required(),
    password:Joi.string().required(),
    email:Joi.string().email().required(),
    first_name:Joi.string().required(),
    last_name:Joi.string().required(),
})

const loginSchema = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).max(100).required(),
})
const createChatSchema = Joi.object({
    name:Joi.string().required(),
    group_type:Joi.string().required(),
    users:Joi.array().required(),
})


router.post(App_url.signUp, validator.body(registerSchema), authControllers.postSignUp);
router.post(App_url.signIn,  validator.body(loginSchema), authControllers.postSignIn);
router.get(App_url.USER_DETAILS, verifyToken, getUserDetails);
// router.post(App_url.CREATE_CHAT_GROUP, validator.body(createChatSchema), verifyToken, createChatGroup);

export { router as authRoutes };