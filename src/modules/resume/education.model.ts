import { Schema } from 'mongoose';

export const EducationSchema = new Schema({
  school: String,
  degree: String,
  startYear: Date,
  endYear: Date
});
