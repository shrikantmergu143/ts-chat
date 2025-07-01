import mongoose, { Schema, Document } from 'mongoose';
import { EducationSchema } from './education.model';
import { ExperienceSchema } from './experience.model';
import { ProjectSchema } from './project.model';
import { SocialSchema } from './social.model';
import { SkillGroupSchema } from './skill.model';

export interface IResume extends Document {
    user_id: mongoose.Types.ObjectId | string;
    name: string;
    position: string;
    contactInformation: string;
    email: string;
    address?: string;
    profilePicture?: string;
    socialMedia: typeof SocialSchema[];
    summary: string;
    education: typeof EducationSchema[];
    workExperience: typeof ExperienceSchema[];
    projects: typeof ProjectSchema[];
    skills: typeof SkillGroupSchema[];
    languages: string[];
    certifications: { name: string; issuer: string }[];
}

const ResumeSchema: Schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
    name: { type: String, required: true },
    position: String,
    contactInformation: String,
    email: String,
    address: String,
    profilePicture: String,
    socialMedia: [SocialSchema],
    summary: String,
    education: [EducationSchema],
    workExperience: [ExperienceSchema],
    projects: [ProjectSchema],
    skills: [SkillGroupSchema],
    languages: [String],
    certifications: [
        {
            name: String,
            issuer: String
        }
    ]
});

export default mongoose.model<IResume>('Resume', ResumeSchema);
