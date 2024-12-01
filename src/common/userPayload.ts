export interface IUserModuleScheme {
    user_id: string;
    _id: string;  // Mongoose uses _id by default
    id?: string; // Optionally allow id (for compatibility with other code)
    profile_url: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    social_links: string;
    date_of_birth: string;
    description: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pin_code: string;
    personal_link: string;
    phone: string;
    created_at: string;
    updated_at: string;
    resume: string;
    is_admin: string;
    user_type: string;
}
const getUserPayload = (user: any) =>{
    const payload:IUserModuleScheme = {
        user_id: "",
        _id: "",
        id: "",
        profile_url: "",
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        social_links: "",
        date_of_birth: "",
        description: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pin_code: "",
        personal_link: "",
        phone: "",
        created_at: "",
        updated_at: "",
        resume: "",
        is_admin: "",
        user_type: "",
    }
    if(user?._id){
        payload.id = user?._id?.toString?.()
    }
    if(user?._id){
        payload._id = user?._id?.toString?.()
    }
    if(user?.user_id){
        payload.user_id = user.user_id
    }
    if(user?.profile_url){
        payload.profile_url = user.profile_url
    }
    if(user?.email){
        payload.email = user.email
    }
    if(user?.username){
        payload.username = user.username
    }
    if(user?.first_name){
        payload.first_name = user.first_name
    }
    if(user?.last_name){
        payload.last_name = user.last_name
    }
    if(user?.social_links){
        payload.social_links = user.social_links
    }
    if(user?.date_of_birth){
        payload.date_of_birth = user.date_of_birth
    }
    if(user?.description){
        payload.description = user.description
    }
    if(user?.address){
        payload.address = user.address
    }
    if(user?.city){
        payload.city = user.city
    }
    if(user?.state){
        payload.state = user.state
    }
    if(user?.country){
        payload.country = user.country
    }
    if(user?.pin_code){
        payload.pin_code = user.pin_code
    }
    if(user?.personal_link){
        payload.personal_link = user.personal_link
    }
    if(user?.phone){
        payload.phone = user.phone
    }
    if(user?.created_at){
        payload.created_at = user.created_at
    }
    if(user?.updated_at){
        payload.updated_at = user.updated_at
    }
    if(user?.resume){
        payload.resume = user.resume
    }
    if(user?.is_admin){
        payload.is_admin = user.is_admin
    }
    if(user?.user_type){
        payload.user_type = user.user_type
    }
    return payload;
}
export { getUserPayload};