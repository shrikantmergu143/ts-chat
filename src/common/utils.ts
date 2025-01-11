export const getEmailUsers = (user:any, users:string[]) =>{
    const response = users?.filter((item)=>item!=user?.id && item!=user?.email);
    if(response?.length>0){
        return response[0];
    }else{
        return null;
    }
}