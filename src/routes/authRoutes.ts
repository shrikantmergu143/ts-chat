import { createValidator } from "express-joi-validation";
import { App_url } from "../common/constant";
import Joi, { optional } from "joi";
import express from "express";
import authControllers from "../controller/auth/authControllers";
import verifyToken from "../middleware/auth";
import chatMessageControllers from "../controller/chatMessages/chatMessageControllers";
import chatGroupControllers from "../controller/chatGroup/chatGroupControllers";
import puppeteerControllers from "../controller/puppeteer/puppeteerControllers";
import multer from "multer";
import { uploadImage } from "../controller/upload/uploadController";
import notificationControllers from "../controller/notifications/notificationControllers";
import {   createResume, getAllResumes, getResumeById, updateResume, deleteResume } from "../controller/resume/resume.controller";

// Multer configuration (store in memory for direct upload)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 }
});
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
const updateInviteGroup = Joi.object({
    user_id:Joi.string(),
    group_id:Joi.string(),
    email:Joi.string(),
    status: Joi.string().valid('pending', 'accepted', 'rejected', 'expired'), // Removed optional chaining
});
// Auth
router.post(App_url.signUp, validator.body(registerSchema), authControllers.postSignUp);
router.post(App_url.signIn,  validator.body(loginSchema), authControllers.postSignIn);
router.get(App_url.USER_DETAILS, verifyToken, authControllers.getUserDetails);
// Group
router.get(App_url.GET_CHAT_GROUP, validator.query(getChatGroupSchema) || validator.body(getChatGroupSchema), verifyToken, chatGroupControllers.getChatGroup);
router.post(App_url.CREATE_CHAT_GROUP, validator.body(createChatSchema), verifyToken, chatGroupControllers.createChatGroup);
router.put(App_url.UPDATE_INVITE_GROUP, validator.body(updateInviteGroup), verifyToken, chatGroupControllers.updateInviteStatus);
router.get(`${App_url.GET_GROUP_DETAILS}/:group_id`, verifyToken, chatGroupControllers.getGroupDetails);
// Messages
router.post(App_url.CREATE_CHAT_MESSAGE, validator.body(createChatMessageSchema), verifyToken, chatMessageControllers.createChatMessage);
router.post(App_url.CHAT_MESSAGES_READ, verifyToken, chatMessageControllers.markMessagesAsRead);
router.put(`${App_url.UPDATE_CHAT_MESSAGE}/:message_id`, validator.body(createChatMessageSchema), verifyToken, chatMessageControllers.createChatMessage);
router.get(`${App_url.GET_CHAT_MESSAGES_LIST}/:group_id`, verifyToken, chatMessageControllers.getChatMessages);
router.delete(`${App_url.DELETE_CHAT_MESSAGE}/:message_id`, verifyToken, chatMessageControllers.deleteChatMessage);

// Notification
router.post(App_url.CHAT_NOTIFICATION_ADD, verifyToken, notificationControllers.addNotificationByMessage);
router.get(`${App_url.CHAT_NOTIFICATION_GET}`, verifyToken, notificationControllers.getNotificationByMessage);
router.get(`${App_url.CHAT_NOTIFICATION_MARK_READ}/:group_id`, verifyToken, notificationControllers.readNotificationByMessage);

router.post(`${App_url.API_RESUME}`, verifyToken, createResume);
router.get(`${App_url.API_RESUME}`, verifyToken, getAllResumes);
router.get(`${App_url.API_RESUME}/:id`, verifyToken, getResumeById);
router.put(`${App_url.API_RESUME}/:id`, verifyToken, updateResume);
router.delete(`${App_url.API_RESUME}/:id`, verifyToken, deleteResume);
// Search Engine
router.post(App_url.search, puppeteerControllers.searchEngine);
router.post(App_url.UPLOAD_FILE, verifyToken, upload.single("image"), uploadImage);

export { router as authRoutes };
