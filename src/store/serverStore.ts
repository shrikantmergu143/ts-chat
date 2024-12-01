const connectUsers = new Map();
interface ISocketConnectStore{
    socketId: string | any;
    user_id: string
}
const addNewConnectedUser = (props: ISocketConnectStore) =>{
    const { socketId, user_id} = props
     connectUsers.set(socketId, {user_id});
}

export {addNewConnectedUser};