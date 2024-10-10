import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  _id: string;
  username: string;
  email: string;
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
  username: string;
}

interface createRoomProps {
  roomId: string;
  AccessToken: string;
  JoinerName: string;
}

// store state of our state

interface StoreState {
  users: User[];
  rooms: createRoomProps[];
  LogInUser: (user: UserLoginProps) => Promise<UserCookiesProps[]>;
  Loading: boolean;
  SignUpUser: (signupUsers: SignUpUserProps) => Promise<User[]>;
  Logout: () => Promise<void>;
  createRoom: (id: string, name: string) => Promise<createRoomProps>;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      users: [],
      rooms: [],
      Loading: false,
      LogInUser: async (user: UserLoginProps): Promise<UserCookiesProps[]> => {
        set({ Loading: true });
        try {
          const url = "http://localhost:9000/api/v1/users/login";
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
          const signUpurl = "http://localhost:9000/api/v1/users/sign-up";
          console.log("this is the signup props from store", signupUsers);
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
          const url = "http://localhost:9000/api/v1/users/log-out";
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

      // create room
      createRoom: async (
        id: string,
      ): Promise<createRoomProps> => {
        set({ Loading: true });
        try {
          const url = "http://localhost:9000/api/v1/room/create-room";
          const result = await axios.post(
            url,
            {
              roomId: id,
            },
            {
              withCredentials: true,
            }
          );

          console.log(
            "result in perfect manner ",
            JSON.stringify(result, null, 2)
          );
          const createdRoom = result.data;
          set((state) => ({
            rooms: [...state.rooms, createdRoom],
          }));
          return createdRoom;
        } catch (err) {
          console.log("something wrong while creating the room", err);
          if (err) {
            toast.error("User not authenticated. Please login again !");
          }
          throw err;
        } finally {
          set({ Loading: false });
        }
      },
    }),
    {
      name: "codelab-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStore;
