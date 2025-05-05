import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [userData, setUserData] = useState(null);

    axios.defaults.withCredentials = true;

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + "api/auth/data");
            if (data.success) {
                setUserData(data.userData);
            } else {
                setUserData(null);
            }
        } catch (error) {
            setUserData(null);
            console.error(error.message);
        }
    };


    useEffect(() => {
        getAuthState();
    }, []);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + "api/auth/is-authenticated");
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData();
            }
        } catch (error) {
            console.error(error.message);
        }
    };


    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
    };

    return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
};