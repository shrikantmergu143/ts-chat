import { Schema } from 'mongoose';

export const SkillGroupSchema = new Schema({
  title: String,
  skills: [String]
});
