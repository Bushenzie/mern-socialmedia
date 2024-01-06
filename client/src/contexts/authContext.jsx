/* eslint-disable */
import {createContext,useEffect,useState} from "react";
import axios from "axios";

export const authContext = createContext({});

export function AuthContextProvider({children}) {
    const [user,setUser] = useState(null)

    useEffect(() => {

        async function getUser() {
            try {
                let resp = await axios.get("http://localhost:3001/users/current",{withCredentials:true});
                await setUser(resp.data.user);
                
            } catch(err) {
                console.log(err?.data?.message);
            }
        }
        
        getUser();
    },[])

    return (
        <authContext.Provider value={{user, setUser}}>
            {children}
        </authContext.Provider>
    )
}
