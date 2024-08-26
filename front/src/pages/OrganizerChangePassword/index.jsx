import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Text, Img } from "components";
import axios from "axios";
// import { Link } from "react-router-dom";

export default function OrganizerChangePassword(){

    const [oldpassword,setOldpassword] = useState("");
    const [newpassword,setNewpassword] = useState("");
    const [confirmpassword,setConfirmpassword] = useState("");
    const [email,setEmail] = useState("");
    const [organizerid, setOrganizerid] = useState("");
    const [error,setError] = useState("");

    useEffect(()=>{
        const storedEmail = localStorage.getItem('email');
        const storedOrganizerid = localStorage.getItem('organizerid')
        if(!storedEmail || !storedOrganizerid){
            alert("Email or organizerid not found in localstorage. Please log in again");
            window.location.href = '/organizer-login';
        }
        else{
            setEmail(storedEmail);
            setOrganizerid(storedOrganizerid);
        }
    },[]);

    const handleChangePassword = async() =>{
        setError("");
        if(!oldpassword) {
            setError("Enter your old password");
            return;
        }
        if(!newpassword) {
            setError("Enter new password");
            return;
        }
        if(!confirmpassword){
            setError("Re-enter your new password");
            return;
        }
        if(newpassword === oldpassword){
            setError("Your new password should not be same as the old password");
            return;
        }
        if (newpassword !== confirmpassword) {
            setError("The Password confirmation does not match");
            return;
        }
        const passwordpattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
        if(!passwordpattern.test(newpassword)){
            setError("Include at least one uppercase letter, one lowercase letter, one number, and one special character to fortify your security");
            return;
        }
        try{
            const response = await axios.post('http://localhost:8080/change-password',{
                email,
                oldpassword,
                newpassword
            });
            console.log(response.data);
            if(response.data.message === 'password changed successfully'){
                alert("password changed successfully");
                window.location.href=`/organizer-login`;
            }
            else if(response.data.message === 'old password is incorrect'){
                setError("Old password is incorrect");
            }
            else{
                setError(response.data.message);
            }
        }
        catch (error) {
            console.error("error changing password",error);
        }
    }
    return (
        <>
        <Helmet>
            <title>Change Password</title>
        </Helmet>
        <div className="flex w-full h-screen">
            <div className="flex items-center justify-center w-1/2 bg-deep_purple-800">
                <Img
                    src="images/epiceventify.png"
                    alt="logo"
                    className="h-[135px] w-[300px] object-cover"
                />
            </div>
            <div className="flex flex-col items-center justify-center w-1/2 bg-white p-10">
                <Text size="2xl" as="p" className="text-black-900 mb-4">
                    Change Password
                </Text>
                <Img
                    src="images/Resetpassword.png"
                    alt="reset password image"
                    className="h-[260px] w-auto mt-3 mb-1"
                />
                <div className="flex flex-col items-center w-full mb-5">
                    <Text size="lg" as="p" className="text-center text-blue_gray-400 mt-6 mb-10">
                        Your new password must be different from the previous password
                    </Text>
                    <div className="flex flex-col items-start">
                        <Text as="p" size="md" className="!text-blue_gray_800">
                            Old Password
                        </Text>
                        <input 
                            type="password" 
                            name="oldpassword"
                            id="oldpassword"
                            placeholder="Old Password"
                            value={oldpassword}
                            onChange={(e)=>setOldpassword(e.target.value)}
                            className="w-[300px] h-[25px] px-2 py-0.5 border border-gray-300 rounded mt-1 mb-4 text-center"
                            style={{ backgroundColor: '#F5F5F5' }}
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <Text as="p" size="md" className="!text-blue_gray_800">
                            New Password
                        </Text>
                        <input 
                            type="password" 
                            name="newpassword"
                            id="newpassword"
                            placeholder="New Password"
                            value={newpassword}
                            onChange={(e)=>setNewpassword(e.target.value)}
                            className="w-[300px] h-[25px] px-2 py-0.5 border border-gray-300 rounded mt-1 mb-4 text-center"
                            style={{ backgroundColor: '#F5F5F5' }}
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <Text as="p" size="md" className="!text-blue_gray_800">
                            Confirm Password
                        </Text>
                        <input 
                            type="password" 
                            name="confirmpassword"
                            id="confirmpassword"
                            placeholder="Confirm Password"
                            value={confirmpassword}
                            onChange={(e) => setConfirmpassword(e.target.value)}
                            className="w-[300px] h-[25px] px-2 py-0.5 border border-gray-300 rounded mt-1 mb-4 text-center"
                            style={{ backgroundColor: '#F5F5F5' }}
                        />
                    </div>
                </div>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                {/* <Link to={`/organizer-login`}> */}
                <button 
                    type="button"
                    onClick={handleChangePassword}
                    className="flex items-center justify-center px-6 py-2 h-[34px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[16px] sm:px-5 border border-deep_purple-800"                    
                >
                        Save
                </button>
                {/* </Link> */}
            </div>
        </div>
        </>
    )
}