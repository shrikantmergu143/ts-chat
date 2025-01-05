export const getEmailUsers = (email:string, users:string[]) =>{
    const response = users?.filter((item)=>item!=email);
    if(response?.length>0){
        return response[0];
    }else{
        return null;
    }
}