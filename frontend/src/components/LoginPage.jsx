import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {backendUrl, isLoggedIn, setIsLoggedIn, getUserData} = useContext(AppContent);

  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) navigate("/landing");
  }, [isLoggedIn]);


  const logInWithEmailAndPassword = async() =>{
    try {
      axios.defaults.withCredentials =true
      const {data} = await axios.post(backendUrl+'api/auth/login', {email:email, password:password});
      if(data.success){
        toast.success("Login successfully")
        setIsLoggedIn(true)
        getUserData()
      }
      
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);  // This is for 400/401/500 errors
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    }
  }


  return (
    <div className="login">
        <p className='text-center mt-20 font-bold text-4xl text-blue-950'>
            Login Page
        </p>
      <div className="bg-white shadow-md rounded-2xl w-3/5 lg:w-1/3 p-5 m-5 flex flex-col justify-center place-self-center border-b-gray-100 border-l-gray-100">
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
        <button
          className="font-bold text-white shadow-md bg-blue-900 mb-4 p-2 w-1/2 place-self-center rounded-2xl hover:cursor-pointer hover:bg-blue-800"
          onClick={() => logInWithEmailAndPassword()}
        >
          Login
        </button>
        
        <div>
          <Link to="/reset" className="underline hover:text-blue-700">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register" className="underline hover:text-blue-700">Register</Link> 
        </div>
      </div>
    </div>
  );
}
export default LoginPage;