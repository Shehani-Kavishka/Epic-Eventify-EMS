import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Img, Text } from "components";
import { useParams } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import HeaderAttendee from "components/HeaderAttendee";
import axios from "axios";

export default function EditAttendeeProfile() {
    const { attendeeid } = useParams();
    const [attendee, setAttendee] = useState({
        fullname: "",
        email: "",
        NIC: "",
        contactno: "",
        profileimage: null
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchAttendee = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/attendees/${attendeeid}`);
                const attendeedata = response.data;
                setAttendee({
                    ...attendeedata,
                    file: null
                });
                setImagePreview(attendeedata.profileimage);
            } catch (error) {
                console.error("Error in fetching attendee data", error);
            }
        };
        fetchAttendee();
    }, [attendeeid]);

    const handlechange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profileimage") {
            const file = files[0];
            setAttendee(prev => ({ ...prev, [name]: file }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setAttendee(prev => ({ ...prev, [name]: value }));
        }
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        const nicpattern = /^\d{12}$|^\d{9}[Vv]$/;
        const contactnopattern = /^(?:\+94|0)(?:(?:7[0-9]|9[0-8])\d{7}|[1-8]1\d{6}|[0-9]{2}\d{7})$/;

        if (!attendee.fullname) newErrors.fullname = "Full Name is required";
        if (!attendee.email) newErrors.email = "Email is required";
        if (!attendee.NIC) {
            newErrors.NIC = "NIC is required";
        } else if (!nicpattern.test(attendee.NIC)) {
            newErrors.NIC = "Enter a valid Sri Lankan NIC";
        }
        if (!attendee.contactno) {
            newErrors.contactno = "Contact No is required";
        } else if (!contactnopattern.test(attendee.contactno)) {
            newErrors.contactno = "Enter a valid Sri Lankan phone number";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const updateAttendeeProfile = async (e) => {
        e.preventDefault();
        console.log("Form submitted. Attendee:", attendee);
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("fullname", attendee.fullname);
        formData.append("email", attendee.email);
        formData.append("NIC", attendee.NIC);
        formData.append("contactno", attendee.contactno);

        if (attendee.profileimage) {
            formData.append("profileimage", attendee.profileimage);
        }
        try {
            await axios.put(`http://localhost:8080/attendees/${attendeeid}/update`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            window.location.href = `/attendee-profile/${attendeeid}`;
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Helmet>
                <title>Edit - Attendee Profile</title>
                <meta />
            </Helmet>
            <div className="w-full">
                <HeaderAttendee attendeeid={attendeeid} />
                <style>
                    {`
                input {backgroundColor: '#F5F5F5';}
            `}
                </style>
            </div>
            <div className="flex w-full min-h-screen items-center justify-center bg-white">
                <div className="flex w-full max-w-3xl flex-col gap-10 px-[26px] md:p-5 sm:px-5">
                    <div className="flex flex-col items-center gap-4">
                        <Text size="2xl" as="p" className="mt-2.5">
                            Edit Profile
                        </Text>
                        <label htmlFor="profileimage">
                            <div className="flex items-center flex-col">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="uploaded" className="h-[100px] w-[100px] rounded-[60px] object-cover border border-deep_purple-800" />
                                ) : (
                                    <Img src={attendee.profileimage} alt="event image" className="h-[100px] w-[100px] rounded-[60px] object-cover border border-deep_purple-800" />
                                )}
                                <i className="fas fa-camera mt-1 text-[20px]"></i>
                                <input
                                    type="file"
                                    id="profileimage"
                                    name="profileimage"
                                    className="hidden"
                                    onChange={handlechange}
                                />
                            </div>
                        </label>
                    </div>
                    <div className="ml-[30px] mr-2 md:mx-0">
                        <div className="flex flex-col gap-10">
                            <div className="flex items-center sm:flex-col">
                                <div className="flex flex-1 flex-col items-start gap-1 sm:self-stretch">
                                    <Text as="p" size="md"> Full Name </Text>
                                    <input
                                        type="text"
                                        name="fullname"
                                        placeholder="Full Name"
                                        className="w-[72%] relative-rounded border-solid border-gray-300 border-2 h-[25px] px-2 py-0.5 sm:pr-5"
                                        value={attendee.fullname}
                                        onChange={handlechange}
                                        style={{ backgroundColor: '#F5F5F5' }}
                                    />
                                    {errors.fullname && <div style={{ color: 'red' }}>{errors.fullname}</div>}
                                </div>
                                <div className="flex w-[42%] flex-col items-start gap-1.5 sm:w-full">
                                    <Text as="p" size="md">Email</Text>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="self-stretch relative-rounded border-solid border-gray-300 border-2 h-[25px] px-2 py-0.5 sm:pr-5"
                                        value={attendee.email}
                                        onChange={handlechange}
                                        style={{ backgroundColor: '#F5F5F5' }}
                                    />
                                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                                </div>
                            </div>

                            <div className="flex items-center sm:flex-col">
                                <div className="flex flex-1 flex-col items-start gap-1 sm:self-stretch">
                                    <Text as="p" size="md"> NIC </Text>
                                    <input
                                        type="text"
                                        name="NIC"
                                        placeholder="NIC no"
                                        className="w-[72%] relative-rounded border-solid border-gray-300 border-2 h-[25px] px-2 py-0.5 sm:pr-5"
                                        value={attendee.NIC}
                                        onChange={handlechange}
                                        style={{ backgroundColor: '#F5F5F5' }}
                                    />
                                    {errors.NIC && <div style={{ color: 'red' }}>{errors.NIC}</div>}
                                </div>
                                <div className="flex w-[42%] flex-col items-start gap-1.5 sm:w-full">
                                    <Text as="p" size="md">Contact No</Text>
                                    <input
                                        type="text"
                                        name="contactno"
                                        placeholder="Contact No"
                                        className="self-stretch relative-rounded border-solid border-gray-300 border-2 h-[25px] px-2 py-0.5 sm:pr-5"
                                        value={attendee.contactno}
                                        onChange={handlechange}
                                        style={{ backgroundColor: '#F5F5F5' }}
                                    />
                                    {errors.contactno && <div style={{ color: 'red' }}>{errors.contactno}</div>}
                                </div>
                            </div>

                            <div className="flex justify-center w-full gap-10 mt-8">
                                <button
                                    type="button"
                                    className="flex items-center justify-center px-6 py-2 h-[34px] sm:px-5 text-deep_purple-800 text-center text-lg font-semibold bg-white-A700 min-w-[225px] rounded-[16px] sm:px-5 border border-deep_purple-800"
                                    onClick={() => window.location.href = `/attendee-profile/${attendeeid}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center px-6 py-2 h-[34px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[16px] sm:px-5 border border-deep_purple-800"
                                    onClick={updateAttendeeProfile}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
