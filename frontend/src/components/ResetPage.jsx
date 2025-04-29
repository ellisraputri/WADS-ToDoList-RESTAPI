import React, { useContext, useEffect, useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import {toast} from "react-toastify"


function ResetPage() {
  const [email, setEmail] = useState("");
  const [secretKey, setSecretKey] =useState("");
  const navigate = useNavigate();
  const {backendUrl, isLoggedIn} = useContext(AppContent);

  useEffect(() => {
    if (isLoggedIn) navigate("/landing");
  }, [isLoggedIn]);

  const verifyKey = async() => {
    axios.defaults.withCredentials = true
    try {
      const {data} = await axios.post(backendUrl+'api/auth/verify-key-reset', {email:email, key:secretKey})
      if(data.success){
        const newpass = window.prompt("Insert your new password: ");
        if(newpass){
          const res1 = await axios.post(backendUrl+'api/auth/reset-password', {email:email, newPassword:newpass});
          if(res1.data.success){
            toast.success("Password has been reset successfully");
            navigate('/');
          }
        }
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

  return (
    <div className="reset">
      <div className="bg-white shadow-md rounded-2xl mt-20 w-3/5 lg:w-1/3 p-5 m-5 flex flex-col justify-center place-self-center border-b-gray-100 border-l-gray-100">
        <input
          type="text"
          className="border border-blue-900 mr-4 p-2 rounded-2xl mb-5 placeholder-cyan-800 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="border border-blue-900 mr-4 p-2 rounded-2xl mb-5 placeholder-cyan-800 text-black"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="Secret Key"
        />
        <button
          className="font-bold text-white shadow-md bg-blue-900 mb-4 p-3 place-self-center rounded-2xl hover:cursor-pointer hover:bg-blue-800"
          onClick={() => verifyKey()}
        >
          Verify Email and Key
        </button>
        <div>
          Don't have an account? <Link to="/register" className="underline hover:text-blue-700">Register</Link>
        </div>
      </div>
    </div>
  );
}
export default ResetPage;