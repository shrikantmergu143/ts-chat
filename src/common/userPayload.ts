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
export interface IChatGroupsMember {
    name:string;
    group_type:"direct" | "group";
    users:string[];
    profile_url:string;
    created_by:string;
    is_active:boolean;
    _id:string;
    created_at:string;
    updated_at:string;
    group_id:string;
}
const getChatMemberPayload = (data: any) =>{
    const payload:IChatGroupsMember = {
        name:"",
        group_type:"direct",
        users:[],
        profile_url:"",
        created_by:"",
        is_active:false,
        _id:"",
        created_at:"",
        updated_at:"",
        group_id:"",
    };
    
    if(data?.name){
        payload.name = data?.name
    }
    if(data?.group_type){
        payload.group_type = data?.group_type
    }
    if(data?.users){
        payload.users = data?.users
    }
    if(data?.profile_url){
        payload.profile_url = data?.profile_url
    }
    if(data?.created_by){
        payload.created_by = data?.created_by
    }
    if(data?.is_active){
        payload.is_active = data?.is_active
    }
    if(data?._id){
        payload._id = data?._id
    }
    if(data?.created_at){
        payload.created_at = data?.created_at
    }
    if(data?.updated_at){
        payload.updated_at = data?.updated_at
    }
    if(data?.group_id){
        payload.group_id = data?.group_id
    }
    return payload;
}

export interface IChatGroupItem{
    _id: string;
    id: string;
    name: string;
    group_type: string;
    users: string;
    profile_url: string;
    created_by: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    group_id: string;
}
const getChatGroupItemPayload = (item: any) =>{
    const payload:any ={
        _id:"",
        id:"",
        name:"",
        group_type:"",
        users:"",
        profile_url:"",
        created_by:"",
        is_active:false,
        created_at:"",
        updated_at:"",
        group_id:"",
        mode:"",
    }
    if(item?._id){
        payload._id = item?._id;
        payload.id = item?._id;
    }//
    if(item?.name){
        payload.name = item?.name;
    }
    if(item?.members_details){
        payload.members_details = item?.members_details;
    }
    if(item?.group_member){
        payload.group_member = item?.group_member;
    }
    if(item?.group_type){
        payload.group_type = item?.group_type;
    }
    if(item?.users){
        payload.users = item?.users;
    }
    if(item?.profile_url){
        payload.profile_url = item?.profile_url;
    }
    if(item?.created_by){
        payload.created_by = item?.created_by;
    }
    if(item?.is_active){
        payload.is_active = item?.is_active;
    }
    if(item?.created_at){
        payload.created_at = item?.created_at;
    }
    if(item?.updated_at){
        payload.updated_at = item?.updated_at;
    }
    if(item?.group_id){
        payload.group_id = item?.group_id;
    }
    if(item?.mode){
        payload.mode = item?.mode;
    }
    return payload;
}

const getGroupMembersItem = (item: any) =>{
    const payload:any ={
        _id: "",
        group_id: "",
        user_id: "",
        joined_at: "",
        updated_at: "",
    }
    if(item?._id){
        payload._id = item?._id;
        payload.id = item?._id;
    }
    if(item?.group_id){
        payload.group_id = item?.group_id;
    }
    if(item?.user_id){
        payload.user_id = item?.user_id;
    }
    if(item?.joined_at){
        payload.joined_at = item?.joined_at;
    }
    if(item?.updated_at){
        payload.updated_at = item?.updated_at;
    }
    return payload;
}
export { getGroupMembersItem, getUserPayload, getChatMemberPayload, getChatGroupItemPayload};