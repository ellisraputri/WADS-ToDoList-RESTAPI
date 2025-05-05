import React, { useContext, useEffect, useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
// import { auth, db, logout } from "../firebase";
// import { query, collection, getDocs, where } from "firebase/firestore";
import { AppContent } from '../context/AppContext.jsx';

function LandingPage() {
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/todolist`; 
        navigate(path);
    }
    const {userData} = useContext(AppContent);
    const [isLoading, setIsLoading] =useState(true);

    useEffect(()=>{
        if(userData) setIsLoading(false);
    }, [userData]);

  return (
    <>
        <h1 className='text-center mt-20 font-semibold text-xl text-blue-950'>
            Welcome {isLoading? "Loading" : userData.fullName}!
        </h1>
        <div className='text-center justify-center flex'>
            <button className='bg-white mt-10 rounded-2xl hover:cursor-pointer text-blue-900 p-4 font-semibold border-l-blue-900 border-b-blue-900 shadow-lg hover:bg-blue-50'
            onClick={routeChange}>
            Click here to proceed!</button>
        </div>
        
    </>
  )
}

export default LandingPage

