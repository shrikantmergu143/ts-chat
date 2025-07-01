import { Schema } from 'mongoose';

export const ExperienceSchema = new Schema({
  company: String,
  position: String,
  description: String,
  keyAchievements: String,
  startYear: Date,
  endYear: Date,
  show: Boolean
});
