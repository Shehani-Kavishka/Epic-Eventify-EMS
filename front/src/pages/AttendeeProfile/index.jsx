import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {Img, Text} from "components";
import HeaderAttendee from "components/HeaderAttendee";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "components/Footer";


export default function AttendeeProfile(){
    const [attendee,setAttendee] = useState(null);
    const {attendeeid} = useParams();

    useEffect(()=>{
        if(!attendeeid) {
            return;
        }

        console.log("Fetching attendee with id: ", attendeeid);
        const fetchAttendee = async () =>{
            try{
                const response = await axios.get(`http://localhost:8080/attendees/${attendeeid}`);
                console.log(response.data);
                setAttendee(response.data);
            }
            catch(err){
                console.log(err);
            }
        };
        fetchAttendee();
    },[attendeeid]);

    const handleChangePassword = async () =>{
        try{
            if (attendee && attendee.email && attendee.attendeeid){
                await axios.post(`http://localhost:8080/send-otp`,{email:attendee.email});
                localStorage.setItem('email',attendee.email);
                localStorage.setItem('attendeeid',attendee.attendeeid);
                window.location.href=`/attendee-email-verify`;
            }
            else{
                alert("Attendee information is incomplete")
            }
        }
        catch(err){
            console.log(err);
        }
    };

    if(!attendee){
        return (
            <div className="flex flex-col w-full items-center bg-white-A700 gap-8 pb-10 md:pb-5">
                <Text as="h2" size="2xl" className="text-center text-deep_purple-800">
                    <strong> Please login to your user account. </strong>
                </Text>
                <button 
                    type="button"
                    className="flex items-center justify-center px-6 py-2 h-[34px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[16px] sm:px-5 border border-deep_purple-800"
                    onClick={()=>window.location.href=`/`}
                >
                    Login
                </button>
                <Footer/>
            </div>
        );
    }

    return(
        <>
        <Helmet>
            <title>Attendee Profile</title>
            <meta />
        </Helmet>

        <div className="flex flex-col w-full items-center bg-white-A700 gap-8 pb-10 md:pb-5">
          <div className="w-full">
          <HeaderAttendee attendeeid={attendeeid}/>
          </div>
            <div className="flex flex-col w-full max-w-4xl bg-blue_gray-100 shadow-lg rounded-lg p-6 gap-8">
                <div className="flex flex-col items-center md:flex-row gap-6">
                    <Img
                    src={attendee.profileimage}
                    alt="attendee-profile-pic"
                    className="h-40 w-40 object-cover rounded-full md:h-32 md:w-32"
                    />
                    <div className="flex flex-col items-start gap-4">
                        <Text as="h1" size="2xl" className="font-bold">
                            <strong>{attendee.fullname}</strong>
                        </Text>
                        <Text size="lg" as="p">
                            <strong>Email : </strong> {attendee.email}   
                        </Text>
                        <Text size="lg" as="p">
                            <strong>NIC : </strong>{attendee.NIC}   
                        </Text>
                        <Text size="lg" as="p">
                            <strong>Contact : </strong>{attendee.contactno}   
                        </Text>
                    </div>
                </div>
                <div className="flex w-full justify-center gap-16 mt-6">
                    <Link to={`/edit-attendee-profile/${attendeeid}`}>
                        <button className="px-6 py-2 bg-deep_purple-800 text-white-A700 font-semibold rounded-lg">
                            Edit Profile
                        </button>
                    </Link>
                    {/* <Link>
                        <button className="px-6 py-2 bg-deep_purple-800 text-white-A700 font-semibold rounded-lg">
                            Change Email
                        </button>
                    </Link> */}
                    <Link to={`/attendee-email-verify`}>
                        <button 
                            className="px-6 py-2 bg-deep_purple-800 text-white-A700 font-semibold rounded-lg"
                            onClick={handleChangePassword}
                        >
                            Change Password
                        </button>
                    </Link>
                </div>  
            </div>
            <Footer/>
        </div>
        </>
    )
}