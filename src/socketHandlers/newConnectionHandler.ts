import { INewConnectionReq } from "../common";
import { addNewConnectedUser } from "../store/serverStore";

import { v4 as uuidV4 } from 'uuid'; // Assuming you're using uuid version 4

const newConnectionHandler = async (socket:INewConnectionReq) =>{
    const userDetails = socket;
    const id = uuidV4();  // Generate unique ID for the socket connection
    addNewConnectedUser({
        socketId:id,
        user_id:userDetails?.user_id,
    })
}

export {newConnectionHandler}