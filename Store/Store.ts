import axios from "axios";
import { create } from "zustand"
import { persist, createJSONStorage} from "zustand/middleware"

interface User {
  _id: string;
  username: string;
  email: string;
}

interface UserLoginProps{
  email : string;
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

interface StoreState {
  users: User[];
  LogInUser: (user: UserLoginProps) => Promise<UserCookiesProps[]>;
  Loading: boolean;
  SignUpUser: (signupUsers: SignUpUserProps) => Promise<User[]>
  Logout : () => Promise<void>;
}


const useStore = create<StoreState>()(
  persist((set, get) => ({
    users: [],
    Loading: false,
    LogInUser: async(user: UserLoginProps):Promise<UserCookiesProps[]> => {
      set({Loading: true})
      try {
        console.log("this is coming from store", user);
        const url = 'http://localhost:9000/api/v1/users/login'
        const result = await axios.post(url, {
          email: user.email,
          password: user.password,
        })
        const userData = Array.isArray(result?.data) ? result.data : [result.data] 
        set({users: userData})
        return userData;

      }catch(err) {
        console.log("Error fetching user ", err);
      }finally {
        set({Loading: false})
      }
      return [];
    },
    //mehthod for signing up users
    SignUpUser : async(signupUsers: SignUpUserProps):Promise<User[]> => {
      set({Loading: true})
      try{
        const signUpurl = 'http://localhost:9000/api/v1/users/sign-up';
        console.log("this is the signup props from store", signupUsers)
        const res = await axios.post(signUpurl, {
          email: signupUsers.email,
          password: signupUsers.password,
          username: signupUsers.username,
        })
        const UserData = Array.isArray(res.data) ? res.data : [res.data];
        set({users: UserData})
        return UserData;

      }catch(err) {
        console.log("something went wrong while signing up user", err)

      }finally{
        set({Loading: false})
      }
      return [];
    },
    
    //logout functionality
    Logout: async() => {
      try {
        const url = 'http://localhost:9000/api/v1/users/sign-up';

      }catch(err) {
        console.log("Something went wrong here !", err);
      }

    }

    // getting all the users   
  }),
  {
    name:"codelab-storage",
    storage: createJSONStorage(() => localStorage)
  }


)
)

export default useStore;