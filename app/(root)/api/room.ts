import axios from "axios";


export const createRoom = async() => {
  try {
    const url = "http://localhost:9000/api/v1/room/create-room";
    const result = await axios.post(url); 
    console.log("this is the result from room", result);
    return result;
  }catch(err) {
    console.log("something went wrong !", err);
    throw err;
  }
}

export const AddUserToRoom = async(hostID: string | null , roomID: string, username: string) => {
  try {
    const url = `http://localhost:9000/api/v1/room/join-room${roomID}`
    // meeting link will be come from backend and 
    // userId will be the users id will come from justand
    const data = await axios.post(url,{
      userId: hostID,
      username: username,
    });
    console.log('This is the data from room.ts', JSON.stringify(data, null, 2))

    return data;

  }catch(err) {
    console.log("something went wrong !", err);
  }
}