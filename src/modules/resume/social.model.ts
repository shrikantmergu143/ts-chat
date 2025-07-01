import { Schema } from 'mongoose';

export const SocialSchema = new Schema({
  socialMedia: String,
  link: String
});
