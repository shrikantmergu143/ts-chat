import { createValidator } from "express-joi-validation";
import { App_url } from "../common/constant";
import Joi, { optional } from "joi";
import express from "express";
import authControllers from "../controller/auth/authControllers";
import verifyToken from "../middleware/auth";
import getUserDetails from "../controller/auth/getUserDetails";
import createChatGroup from "../controller/chatGroup/createChatGroup";
import getChatGroup from "../controller/chatGroup/getChatGroup";
import getGroupDetails from "../controller/chatGroup/getGroupDetails";
import chatMessageControllers from "../controller/chatMessages/chatMessageControllers";

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
    name: Joi.string().when("group_type", {
        is: "direct",
        then: Joi.string(),
        otherwise: Joi.string().required(),
    }),
    group_type: Joi.string().valid("direct", "group").required(), // Restrict to "direct" or "group"
    mode: Joi.string().valid("private", "public").required(), // Restrict to "direct" or "group"
    users: Joi.array().when("group_type", {
        is: "direct",
        then: Joi.array().items(Joi.string().email().required()).min(2).required(),
        otherwise: Joi.array().items(Joi.string().required()).min(1).required(),
    }),
})

const getChatGroupSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    group_type: Joi.string().allow("").optional().valid("direct", "group"), // Removed optional chaining
    search: Joi.string().allow("").optional(),
});

const createChatMessageSchema = Joi.object({
    message:Joi.string(),
    media_url:Joi.string().allow("").optional(),
    group_id:Joi.string(),
    reply_id:Joi.string().allow("").optional(),
    message_type: Joi.string().valid("image", "video", "text", "file"), // Removed optional chaining
});

router.post(App_url.signUp, validator.body(registerSchema), authControllers.postSignUp);
router.post(App_url.signIn,  validator.body(loginSchema), authControllers.postSignIn);
router.get(App_url.USER_DETAILS, verifyToken, getUserDetails);
router.get(App_url.GET_CHAT_GROUP, validator.query(getChatGroupSchema) || validator.body(getChatGroupSchema), verifyToken, getChatGroup);
router.post(App_url.CREATE_CHAT_GROUP, validator.body(createChatSchema), verifyToken, createChatGroup);
router.get(`${App_url.GET_GROUP_DETAILS}/:group_id`, verifyToken, getGroupDetails);
router.post(App_url.CREATE_CHAT_MESSAGE, validator.body(createChatMessageSchema), verifyToken, chatMessageControllers.createChatMessage);
router.put(`${App_url.UPDATE_CHAT_MESSAGE}/:message_id`, validator.body(createChatMessageSchema), verifyToken, chatMessageControllers.createChatMessage);
router.get(`${App_url.GET_CHAT_MESSAGES_LIST}/:group_id`, verifyToken, chatMessageControllers.getChatMessages);

export { router as authRoutes };
