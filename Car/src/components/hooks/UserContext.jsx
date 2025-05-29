import React, {createContext, useState, useContext, useEffect} from "react";
import { socketManager } from '../../utils/socket';

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    
   
    useEffect(() => {
        if (user?.user_id) {
            socketManager.connect(user.user_id);
        }
        return () => {
            socketManager.disconnect();
        };
    }, [user]);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};
export const useUser = () => useContext(UserContext);