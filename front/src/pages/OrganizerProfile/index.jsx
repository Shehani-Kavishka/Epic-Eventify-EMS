import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {Img, Text} from "components";
import Header from "components/Header";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "components/Footer";


export default function OrganizerProfile(){
    const [organizer,setOrganizer] = useState(null);
    const {organizerid} = useParams();

    useEffect(()=>{
        if(!organizerid) {
            return;
        }

        console.log("Fetching organizer with id: ", organizerid);
        const fetchOrganizer = async () =>{
            try{
                const response = await axios.get(`http://localhost:8080/organizers/${organizerid}`);
                console.log(response.data);
                setOrganizer(response.data);
            }
            catch(err){
                console.log(err);
            }
        };
        fetchOrganizer();
    },[organizerid]);

    const handleChangePassword = async () =>{
        try{
            if (organizer && organizer.email && organizer.organizerid){
                await axios.post(`http://localhost:8080/send-otp`,{email:organizer.email});
                localStorage.setItem('email',organizer.email);
                localStorage.setItem('organizerid',organizer.organizerid);
                window.location.href=`/organizer-email-verify`;
            }
            else{
                alert("organizer information is incomplete")
            }
        }
        catch(err){
            console.log(err);
        }
    };

    if(!organizer){
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
            <title>Organizer Profile</title>
            <meta />
        </Helmet>

        <div className="flex flex-col w-full items-center bg-white-A700 gap-8 pb-10 md:pb-5">
          <div className="w-full">
          <Header/>
          </div>
            <div className="flex flex-col w-full max-w-4xl bg-blue_gray-100 shadow-lg rounded-lg p-6 gap-8">
                <div className="flex flex-col items-center md:flex-row gap-6">
                    <Img
                    src={organizer.profileimage}
                    alt="organizer-logo"
                    className="h-40 w-40 object-cover rounded-full md:h-32 md:w-32"
                    />
                    <div className="flex flex-col items-start gap-4">
                        <Text as="h1" size="2xl" className="font-bold">
                            <strong>{organizer.fullname}</strong>
                        </Text>
                        <Text size="lg" as="p">
                            {organizer.contactno}   
                        </Text>
                        <Text size="lg" as="p">
                            {organizer.email}   
                        </Text>
                        <Text size="lg" as="p">
                            {organizer.businessaddress}   
                        </Text>
                    </div>
                </div>
                <div className="flex flex-col w-full md:flex-row justify-between gap-6">
                    <div className="flex flex-col w-full md:w-1/2">
                        <Text as="p" size="xl" className="mb-4">
                            <strong>Contacts</strong>
                        </Text>
                        <div className="flex flex-col gap-2">
                            <div className="flex itmes-center">
                                <Text as="p" size="lg" className="mr-4">
                                    <strong>{organizer.contactperson1} : </strong> 
                                </Text>
                                <Text as="p" size="lg">
                                    {organizer.contactno1} 
                                </Text>
                            </div>
                            <div className="flex items-center">
                                <Text as="p" size="lg" className="mr-4">
                                    <strong>{organizer.contactperson2} : </strong> 
                                </Text>
                                <Text as="p" size="lg">
                                    {organizer.contactno2} 
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>                                                      
                <div className="flex w-full justify-center gap-16 mt-6">
                    <Link to={`/edit-organizer-profile/${organizerid}`}>
                        <button className="px-6 py-2 bg-deep_purple-800 text-white-A700 font-semibold rounded-lg">
                            Edit Profile
                        </button>
                    </Link>
                    {/* <Link>
                        <button className="px-6 py-2 bg-deep_purple-800 text-white-A700 font-semibold rounded-lg">
                            Change Email
                        </button>
                    </Link> */}
                    <Link to={`/organizer-email-verify`}>
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