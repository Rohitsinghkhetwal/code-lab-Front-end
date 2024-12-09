import axios from "axios";

export const createRoom = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/room/create-room`;
    const result = await axios.post(
      url,
      {},
      {
        withCredentials: true,
      }
    );
    return result;
  } catch (err) {
    console.log("something went wrong !", err);
    throw err;
  }
};

export const AddUserToRoom = async (
  hostID: string | null,
  roomId: string,
  username: string | null
) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/room/join-room/${roomId}`;
    // meeting link will be come from backend and
    // userId will be the users id will come from justand
    const data = await axios.post(
      url,
      {
        userId: hostID,
        username: username,
      },
      {
        withCredentials: true,
      }
    );

    return data;
  } catch (err) {
    console.log("something went wrong !", err);
  }
};

export const checkUserLoggedInorNot = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/validator/validate`;
    const data = await axios.post(
      url,
      {},
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (err) {
    console.log("something went wrong while checking...");
  }
};

export const LeaveRoom = async (roomId: string, userId: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/room/leave-room`;
    const result = await axios.post(
      url,
      {
        roomId: roomId,
        userId: userId,
      },
      {
        withCredentials: true,
      }
    );
    return result;
  } catch (err) {
    console.log("Something went wrong while leaving the room", err);
    throw err;
  }
};

export const getRoomDetail = async (roomId: string) => {
  try {
    const getRoomDetailUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/room/getAll-room/${roomId}`;
    const response = await axios.get(
      getRoomDetailUrl,
      {
        withCredentials: true
      }
    );
    return response.data;
  } catch (err) {
    console.log("Something went wrong while getting the room Detail");
    throw err;
  }
};
