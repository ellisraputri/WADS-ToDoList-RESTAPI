import React, { useContext, useEffect, useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
// import {
//   auth,
//   registerWithEmailAndPassword,
//   signInWithGoogle,
// } from "../firebase";


function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [secretKey, setSecretKey] =useState("");
  const {backendUrl, isLoggedIn, setIsLoggedIn, getUserData} = useContext(AppContent);
  const navigate = useNavigate();

  const register = async() => {
    axios.defaults.withCredentials = true
    try {
      const {data} = await axios.post(backendUrl+'api/auth/register', {fullName:name, email:email, password:password, secretKey:secretKey})
      if(data.success){
        toast.success("Registered successfully");
        setIsLoggedIn(true);
        getUserData();
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);  // This is for 400/401/500 errors
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/landing");
  }, [isLoggedIn]);


  return (
    <div className="register">
        <p className='text-center mt-20 font-bold text-4xl text-blue-950'>
            Register Page
        </p>
      <div className="bg-white shadow-md rounded-2xl w-3/5 lg:w-1/3 p-5 m-5 flex flex-col justify-center place-self-center border-b-gray-100 border-l-gray-100">
        <input
            type="text"
            className="border border-blue-900 mr-4 p-2 rounded-2xl mb-5 placeholder-cyan-800 text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
        />
        <input
          type="text"
          className="border border-blue-900 mr-4 p-2 rounded-2xl mb-5 placeholder-cyan-800 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="border mb-5 border-blue-900 mr-4 p-2 rounded-2xl placeholder-cyan-800 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          type="password"
          className="border border-blue-900 mr-4 p-2 rounded-2xl mb-5 placeholder-cyan-800 text-black"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="Secret Key"
        />
        <button
          className="font-bold text-white shadow-md bg-blue-900 mb-4 p-2 w-1/2 place-self-center rounded-2xl hover:cursor-pointer hover:bg-blue-800"
          onClick={() => register()}
        >
          Register
        </button>
        
        <div>
          Already have an account? <Link to="/" className="underline hover:text-blue-700">Login</Link> 
        </div>
      </div>
      
      </div>
  );
}
export default RegisterPage;