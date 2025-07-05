import { Response } from 'express';
import Resume from '../../modules/resume/resume.model';
import { IRequestUserDetails } from '../../middleware/auth';

export const createResume = async (req: IRequestUserDetails, res: Response): Promise<any>  => {
  try {
    if(req?.body){
        const resume = new Resume({...req?.body, user_id: req?.user?.id});
        const savedResume = await resume?.save?.();
        res?.status?.(200)?.json?.(savedResume);
    }else{
        res?.status?.(400)?.json?.({ message: 'Error creating resume' });
    }
  } catch (error) {
    res?.status?.(400)?.json?.({ message: 'Error creating resume', error });
  }
};


// Get All Resumes
export const getAllResumes = async (req: IRequestUserDetails, res: Response): Promise<any>  => {
  try {
    const resumes = await Resume?.find?.({user_id: req?.user?.id});
    res?.status?.(200)?.json?.(resumes);
  } catch (error) {
    res?.status?.(500)?.json?.({ message: 'Error fetching resumes', error });
  }
};

export const getResumeById = async (req: IRequestUserDetails, res: Response): Promise<any> => {
  try {
    const resume = await Resume?.findOne?.({ _id: req?.params?.id, user_id: req?.user?.id });
    if (!resume) return res?.status?.(404)?.json?.({ message: 'Resume not found or unauthorized' });
    res?.status?.(200)?.json?.(resume);
  } catch (error) {
    res?.status?.(500)?.json?.({ message: 'Error fetching resume', error });
  }
};


export const updateResume = async (req: IRequestUserDetails, res: Response): Promise<any> => {
  try {
    const updatedResume = await Resume?.findOneAndUpdate?.(
      { _id: req?.params?.id, user_id: req?.user?.id },
      req?.body,
      { new: true }
    );
    if (!updatedResume) return res?.status?.(404)?.json?.({ message: 'Resume not found or unauthorized' });
    res?.status?.(200)?.json?.(updatedResume);
  } catch (error) {
    res?.status?.(400)?.json?.({ message: 'Error updating resume', error });
  }
};


// Delete Resume
export const deleteResume = async (req: IRequestUserDetails, res: Response): Promise<any> => {
  try {
    const deletedResume = await Resume?.findOneAndDelete?.({
      _id: req?.params?.id,
      user_id: req?.user?.id,
    });
    if (!deletedResume) return res?.status?.(404)?.json?.({ message: 'Resume not found or unauthorized' });
    res?.status?.(200)?.json?.({ message: 'Resume deleted successfully' });
  } catch (error) {
    res?.status?.(500)?.json?.({ message: 'Error deleting resume', error });
  }
};

