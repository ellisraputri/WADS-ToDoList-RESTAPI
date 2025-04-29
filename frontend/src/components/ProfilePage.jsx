import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import defaultProfile from "../assets/pic1.jpg";
import { AppContent } from "../context/AppContext.jsx"
import axios from "axios";
import {toast} from 'react-toastify';

function ProfilePage() {
    const {backendUrl, userData} = useContext(AppContent);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [imageUrl, setImageUrl] =useState("");
    const [isLoading, setIsLoading] =useState(true);
    const [isUploading, setIsUploading] =useState(false);


    const handleImageChange=async(e)=>{
        const image = e.target.files[0];
        if (!image) return;

        setIsUploading(true);

        try {
            const imageFormData = new FormData();
            imageFormData.append('file', image); 
    
            const { data: uploadData } = await axios.post(
                backendUrl + 'api/auth/upload-image', 
                imageFormData, 
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            ).catch(error => {
                console.error("Image upload error:", error);
                toast.error("Image upload failed. Please try again.");
                throw error; 
            });
    
            if(!uploadData?.imageUrl) {
                toast.error("Image upload failed");
                return;
            }
    
            axios.defaults.withCredentials =true
            const { data } = await axios.post(backendUrl + 'api/auth/update-profile', {imageUrl: uploadData.imageUrl});
            
            if(data.success) {
              toast.success(data.message);
              setImageUrl(uploadData.imageUrl);
            } 
    
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);  // This is for 400/401/500 errors
            } else {
                toast.error("Something went wrong");
            }
            console.error(error);
        } finally{
            setIsUploading(false);
        }
    }
    

    const updateBio = async (newBio) => {
        try {
            const {data} =await axios.post(backendUrl+'api/auth/update-bio', {newbio: newBio});
            if(data.success){
                toast.success(data.message);
                setBio(newBio);
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
        if(userData){
            setIsLoading(false);
            setName(userData.fullName);
            setEmail(userData.email);
            setBio(userData.bio);
            setImageUrl(userData.profileImage);
        }
    }, [userData]);

    return (
        <>
            <p className='text-center mt-10 font-semibold text-4xl text-blue-950'>Profile Page</p>
            <div className='flex flex-col justify-center mt-5 mb-5'>
                <img 
                    src={imageUrl===""? defaultProfile: imageUrl} 
                    alt="Profile" 
                    className="w-40 place-self-center h-40 rounded-full object-cover"
                />
                <div className="flex flex-col items-center gap-3">
                    <label htmlFor="file-upload" className="cursor-pointer mt-3 font-semibold bg-blue-900 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-800 transition">
                        {isUploading? <span className="spinner"></span> : "Upload Image"}
                    </label>
                    <input 
                        id="file-upload" 
                        type="file" 
                        className="hidden" 
                        onChange={handleImageChange} 
                    />
                </div>
            </div>
            <div className='mb-4'>
                <p className='text-center text-xl text-blue-900'><b>Name:</b></p>
                <p className='text-center text-xl text-blue-900'>{isLoading? "Loading..." : name}</p>
            </div>
            <div className='mb-4'>
                <p className='text-center text-xl text-blue-900'><b>Email:</b></p>
                <p className='text-center text-xl text-blue-900'>{email}</p>
            </div>
            <div className="flex flex-col justify-center">
                <p className='text-center text-xl text-blue-900'><b>Bio:</b></p>
                <textarea
                    className='border border-blue-900 p-2 rounded-2xl w-1/2 mx-auto block text-black'
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
                <button
                    className="mt-4 shadow-md font-semibold bg-blue-900 w-40 cursor-pointer place-self-center text-white p-2 rounded-2xl hover:bg-blue-800"
                    onClick={() => updateBio(bio)}
                >
                    Save Bio
                </button>
            </div>
        </>
    );
}

export default ProfilePage;
