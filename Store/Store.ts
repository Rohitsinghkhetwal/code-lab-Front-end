
import { getRoomDetail, createRoom } from "@/app/(root)/api/room";
import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface userResponse {
  user: User;
  message: string;
}

interface UserLoginProps {
  email: string;
  password: string;
}

interface UserCookiesProps {
  user: UserCookiesProps[];
  refreshToken: string;
}

interface SignUpUserProps {
  email: string;
  password: string;
  username: string | undefined;
}

interface createRoomProps {
  roomId: string;
  name: string;
}



// store state of our state

interface StoreState {
  users: userResponse[],
  joinedUser: string[],
  addUser: (username: string) => void,
  removeUser: (username: string) => void,
  roomLink: string,
  rooms: createRoomProps[];
  LogInUser: (user: UserLoginProps) => Promise<UserCookiesProps[]>;
  Loading: boolean;
  SignUpUser: (signupUsers: SignUpUserProps) => Promise<User[]>;
  Logout: () => Promise<void>;
  CreateRoom: () => Promise<void>
  ClearRoomLink: () => void
  updateRoomLink: (link: string) => void
  localStream: MediaStream | null;
  setLocalStream: (stream: MediaStream) => void
  clearLocalStream: () => void
  fetchJoinedUser: (roomLink: string) => Promise<void>
  clearJoinedUser: () => void
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      users: [],
      joinedUser: [],
      roomLink: "",
      rooms: [],
      Loading: false,
      LogInUser: async (user: UserLoginProps): Promise<UserCookiesProps[]> => {
        set({ Loading: true });
        try {
          const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/users/login`;
          const result = await axios.post(
            url,
            {
              email: user.email,
              password: user.password,
            },
            {
              withCredentials: true,
            }
          );
          const userData = Array.isArray(result?.data)
            ? result.data
            : [result.data];

          set({ users: userData });
          return userData;
        } catch (err) {
          console.log("Error fetching user ", err);
        } finally {
          set({ Loading: false });
        }
        return [];
      },
      //mehthod for signing up users
      SignUpUser: async (signupUsers: SignUpUserProps): Promise<User[]> => {
        set({ Loading: true });
        try {
           
          const signUpurl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/users/sign-up`;
          const res = await axios.post(signUpurl, {
            email: signupUsers.email,
            password: signupUsers.password,
            username: signupUsers.username,
          });
          const UserData = Array.isArray(res.data) ? res.data : [res.data];

          set({ users: UserData });
          return UserData;
        } catch (err) {
          console.log("something went wrong while signing up user", err);
        } finally {
          set({ Loading: false });
        }
        return [];
      },

      //logout functionality
      Logout: async () => {
        try {
          const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/users/log-out`;
          const res = await axios.post(
            url,
            {},
            {
              withCredentials: true,
            }
          );
          set({ users: [] });
        } catch (err) {
          console.log("Something went wrong here !", err);
        }
      },
      //creating the room and saving the room link to store
      CreateRoom: async() => {
        try {
          const result = await createRoom();
          const getRoomLink = result?.data?.result?.link;
          set({roomLink: getRoomLink});
          return getRoomLink;
        }catch(err) {
          console.log("something went wrong !", err);
          throw err;

        }
      },

      ClearRoomLink: () => {
        set({ roomLink: ""});
      },

      updateRoomLink: (link) => {
        set({ roomLink: link})
      },

      localStream: null,
      setLocalStream: (stream) => set({localStream: stream}),
      clearLocalStream: () => set({ localStream: null}),

      fetchJoinedUser: async(roomId: string) => {
        try{
          const response = await getRoomDetail(roomId);
          const res = response.users.map((user: any) => (user.username));
          set({joinedUser: res})
        }catch(err) {
          console.log("something wrong while fetching the users");
          throw err;
        }

      },
      addUser: (user) => set((state) => ({ joinedUser: [...state.joinedUser, user]})),

      removeUser: (username: string) => set((state) => ({ joinedUser: state.joinedUser.filter((user) => user !== username)})),

      clearJoinedUser: () => {
        set({ joinedUser: []})
      },
      
    }),
    {
      name: "codelab-storage",
      storage: createJSONStorage(() => {
        if(typeof window !== "undefined") {
          return localStorage
        }else {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
      })
    }
  )
);

export default useStore;
