import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Text, Img } from "components";
import axios from "axios";

export default function AttendeeEmailVerification(){

    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [attendeeid, setAttendeeid] = useState("");
    const [error, setError] = useState("");

    useEffect(() =>{
        const storedEmail = localStorage.getItem('email');
        const storedAttendeeid = localStorage.getItem('attendeeid');

        if(storedEmail && storedAttendeeid) {
            setEmail(storedEmail);
            setAttendeeid(storedAttendeeid);
        }
        else{
            alert("email or attendee id is not found.");
            window.location.href = '/attendee-login';
        }
    },[]);
    
    const handleVerifyOtp = async() =>{
        setError("");

        if(!otp)
            {
                setError("Enter the verification code");
                return;
            }
        try{
            console.log("Retrieved email from localStorage:", email);
            if (!email || !attendeeid) {
                throw new Error("Email or attendee id is null");
            }
            const response = await axios.post('http://localhost:8080/verify-otp',{email,otp});
            if(response.data.message === 'OTP verified'){
                window.location.href=`/attendee-change-pw`;
            }
            else{
                setError("Incorrect verification code");
            }
        }
        catch(err){
            console.log(err);
            setError("Incorrect verification code");
        }
    };

    return (
        <>
        <Helmet>
            <title>Email Verification</title>
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
                <Text size="2xl" as="p" className="text-black-900 mb-14">
                    Email Verification
                </Text>
                <Img
                    src="images/Verification.png"
                    alt="otp image"
                    className="h-[260px] w-auto mb-5"
                />
                <div className="flex flex-col items-center w-full mb-5">
                    <Text size="lg" as="p" className="text-center text-blue_gray-400 mt-10 mb-2">
                        Enter the verification code that is sent to your email:
                    </Text>
                    <input 
                        type="text" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        name="verificationcode"
                        id="verificationcode"
                        placeholder="Enter Verification Code"
                        className="w-2/5 h-[25px] px-2 py-0.5 border border-gray-300 rounded mt-6 mb-4 text-center"
                        style={{ backgroundColor: '#F5F5F5' }}
                    />
                    {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                </div>
                
                    <button 
                        type="button"
                        className="flex items-center justify-center px-6 py-2 h-[34px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[16px] sm:px-5 border border-deep_purple-800"                    
                        onClick={handleVerifyOtp}
                    >
                            Verify
                    </button>
                
            </div>
        </div>
        </>
    )
}