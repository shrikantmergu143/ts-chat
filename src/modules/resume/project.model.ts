import { Schema } from 'mongoose';

export const ProjectSchema = new Schema({
  name: String,
  description: String,
  keyAchievements: String,
  startYear: Date,
  endYear: Date,
  link: String,
  show: Boolean
});
