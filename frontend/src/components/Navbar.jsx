import React, { useContext, useEffect } from 'react';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
// import { logout } from '../firebase';

function Navbar() {
  const location = useLocation(); 
  const navigate = useNavigate();
  const {backendUrl, setIsLoggedIn, isLoggedIn} =useContext(AppContent);

  useEffect(()=>{
    if(isLoggedIn === false) navigate('/')
  },[isLoggedIn])

  const handleLogout =async()=>{
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        axios.defaults.withCredentials =true
        const {data} = await axios.post(backendUrl+'api/auth/logout')
        if(data.success){
          toast.success("Logout successfully")
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const isActive = (path) => location.pathname === path ? 'text-blue-500' : 'text-white hover:text-blue-500';

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <FontAwesomeIcon icon={faNoteSticky} className="h-8 text-white text-2xl" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">To Do List</span>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link to="/landing" className={`block py-2 px-3 md:p-0 ${isActive('/landing')}`} aria-current="page">Home</Link>
            </li>
            <li>
              <Link to="/todolist" className={`block py-2 px-3 md:p-0 ${isActive('/todolist')}`}>To Do List</Link>
            </li>
            <li>
              <Link to="/profile" className={`block py-2 px-3 md:p-0 ${isActive('/profile')}`}>Profile</Link>
            </li>
            <li>
              <Link to={location} className={`block py-2 px-3 md:p-0 text-white hover:text-blue-500`} onClick={handleLogout}>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
