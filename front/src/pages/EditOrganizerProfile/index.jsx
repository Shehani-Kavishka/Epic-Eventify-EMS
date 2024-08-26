import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Img, Text } from "components";
import { useParams } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from "components/Header";
import axios from "axios";

export default function EditOrganizerProfile() {
    const { organizerid } = useParams();
    const [organizer, setOrganizer] = useState({
        fullname: "",
        email: "",
        contactno: "",
        businessaddress: "",
        contactperson1: "",
        contactno1: "",
        contactperson2: "",
        contactno2: "",
        profileimage: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const fetchOrganizer = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/organizers/${organizerid}`);
                const organizerdata = response.data;
                setOrganizer({
                    ...organizerdata,
                    file: null
                });
                setImagePreview(organizerdata.profileimage);
            } catch (error) {
                console.error("Error in fetching organizer data", error);
            }
        };
        fetchOrganizer();
    }, [organizerid]);

    const handlechange = (e) => {
        if (e.target.name === "profileimage") {
            const file = e.target.files[0];
            setOrganizer(prev => ({ ...prev, [e.target.name]: file }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setOrganizer(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
        setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        const contactnopattern = /^(?:\+94|0)(?:(?:7[0-9]|9[0-8])\d{7}|[1-8]1\d{6}|[0-9]{2}\d{7})$/;

        if (!organizer.fullname) newErrors.fullname = "Organizer name is required";
        if (!organizer.contactno) {
            newErrors.contactno = "Contact no is required";
        } else if (!contactnopattern.test(organizer.contactno)) {
            newErrors.contactno = "Enter a valid Sri Lankan phone number";
        }
        if (!organizer.email) newErrors.email = "Email is required";
        if (!organizer.businessaddress) newErrors.businessaddress = "Address is required";
        if (!organizer.contactperson1) newErrors.contactperson1 = "This field is required";
        if (!organizer.contactperson2) newErrors.contactperson2 = "This field is required";
        if (!organizer.contactno1) {
            newErrors.contactno1 = "Contact no is required";
        } else if (!contactnopattern.test(organizer.contactno1)) {
            newErrors.contactno1 = "Enter a valid Sri Lankan phone number";
        }
        if (!organizer.contactno2) {
            newErrors.contactno2 = "Contact no is required";
        } else if (!contactnopattern.test(organizer.contactno2)) {
            newErrors.contactno2 = "Enter a valid Sri Lankan phone number";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateOrganizerProfile = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("fullname", organizer.fullname);
        formData.append("contactno", organizer.contactno);
        formData.append("email", organizer.email);
        formData.append("businessaddress", organizer.businessaddress);
        formData.append("contactperson1", organizer.contactperson1);
        formData.append("contactno1", organizer.contactno1);
        formData.append("contactperson2", organizer.contactperson2);
        formData.append("contactno2", organizer.contactno2);

        if (organizer.profileimage) {
            formData.append("profileimage", organizer.profileimage);
        }
        try {
            await axios.put(`http://localhost:8080/organizers/${organizerid}/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            window.location.href = `/organizer-profile/${organizerid}`;
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Helmet>
                <title>Edit - Organizer Profile</title>
                <meta />
            </Helmet>
            <div className="w-full">
                <Header />
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
                                    <Img src={organizer.profileimage} alt="event image" className="h-[100px] w-[100px] rounded-[60px] object-cover border border-deep_purple-800" />
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
                                    <Text as="p" size="md"> Organizer Name </Text>
                                    <input
                                        type="text"
                                        name="fullname"
                                        placeholder="Organizer Name"
                                        className="w-[72%] relative-rounded border-solid border-gray-300 border-2 h-[25px] px-2 py-0.5 sm:pr-5"
                                        value={organizer.fullname}
                                        onChange={handlechange}
                                        style={{ backgroundColor: '#F5F5F5' }}
                                    />
                                    {errors.organizername && <div style={{ color: 'red' }}>{errors.organizername}</div>}
                                </div>
                                <div className="flex w-[42%] flex-col items-start gap-1.5 sm:w-full">
                                    <Text as="p" size="md">Business Contact Number</Text>
                                    <input
                                        type="text"
                                        name="contactno"
                                        placeholder="Business Contact Number"
                                        className="self-stretch relative-rounded border-solid border-gray-300 border-2 h-[25px] px-2 py-0.5 sm:pr-5"
                                        value={organizer.contactno}
                                        onChange={handlechange}
                                        style={{ backgroundColor: '#F5F5F5' }}
                                    />
                                    {errors.businesscontactno && <div style={{ color: 'red' }}>{errors.businesscontactno}</div>}
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-1">
                                <Text as="p" size="md">Business Email</Text>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Business Email"
                                    className="self-stretch relative-rounded border-2 h-[25px] px-2 py-0.5 border-solid border-gray-300 sm:pr-5"
                                    value={organizer.email}
                                    onChange={handlechange}
                                    style={{ backgroundColor: '#F5F5F5' }}
                                />
                                {errors.businessemail && <div style={{ color: 'red' }}>{errors.businessemail}</div>}
                            </div>

                            <div className="flex flex-col items-start gap-1">
                                <Text as="p" size="md">Business Address</Text>
                                <input
                                    type="text"
                                    name="businessaddress"
                                    placeholder="Business Address"
                                    className="self-stretch relative-rounded border-2 h-[25px] px-2 py-0.5 border-solid border-gray-300 sm:pr-5"
                                    value={organizer.businessaddress}
                                    onChange={handlechange}
                                    style={{ backgroundColor: '#F5F5F5' }}
                                />
                                {errors.businessaddress && <div style={{ color: 'red' }}>{errors.businessaddress}</div>}
                            </div>

                            <div className="flex sm:flex-col">
                                <div className="flex w-full flex-col items-start gap-[42px] sm:w-full">
                                    <div className="flex w-[84%] flex-col items-start gap-0.5 md:w-full">
                                        <Text as="p" size="md">Contact Person 1</Text>
                                        <input
                                            type="text"
                                            shape="round"
                                            name="contactperson1"
                                            placeholder="Contact Person"
                                            className="self-stretch relative-rounded border-2 h-[25px] px-2 py-0.5 border-solid border-gray-300 sm:pr-5"
                                            value={organizer.contactperson1}
                                            onChange={handlechange}
                                            style={{ backgroundColor: '#F5F5F5' }}
                                        />
                                        {errors.contactperson1 && <div style={{ color: 'red' }}>{errors.contactperson1}</div>}
                                    </div>
                                    <div className="flex w-[84%] flex-col gap-10 md:w-full">
                                        <div className="mr-1.5 flex flex-col items-start gap-0.5 md:mr-0">
                                            <Text as="p" size="md">Contact Person 2</Text>
                                            <input
                                                type="text"
                                                shape="round"
                                                name="contactperson2"
                                                placeholder="Contact Person"
                                                className="self-stretch relative-rounded border-2 h-[25px] px-2 py-0.5 border-solid border-gray-300 sm:pr-5"
                                                value={organizer.contactperson2}
                                                onChange={handlechange}
                                                style={{ backgroundColor: '#F5F5F5' }}
                                            />
                                            {errors.contactperson2 && <div style={{ color: 'red' }}>{errors.contactperson2}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full flex-col items-end gap-10 sm:w-full">
                                    <div className="flex w-[84%] flex-col items-start gap-0.5 md:w-full">
                                        <Text as="p" size="md">Contact Number</Text>
                                        <input
                                            type="text"
                                            shape="round"
                                            name="contactno1"
                                            placeholder="Contact Number"
                                            className="self-stretch relative-rounded border-2 h-[25px] px-2 py-0.5 border-solid border-gray-300 sm:pr-5"
                                            value={organizer.contactno1}
                                            onChange={handlechange}
                                            style={{ backgroundColor: '#F5F5F5' }}
                                        />
                                        {errors.contactno1 && <div style={{ color: 'red' }}>{errors.contactno1}</div>}
                                    </div>
                                    <div className="flex w-[84%] flex-col items-start gap-0.5 md:w-full">
                                        <Text as="p" size="md">Contact Number</Text>
                                        <input
                                            type="text"
                                            shape="round"
                                            name="contactno2"
                                            placeholder="Contact Number"
                                            className="self-stretch relative-rounded border-2 h-[25px] px-2 py-0.5 border-solid border-gray-300 sm:pr-5"
                                            value={organizer.contactno2}
                                            onChange={handlechange}
                                            style={{ backgroundColor: '#F5F5F5' }}
                                        />
                                        {errors.contactno2 && <div style={{ color: 'red' }}>{errors.contactno2}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center w-full gap-10 mt-8">
                            <button
                                type="button"
                                className="flex items-center justify-center px-6 py-2 h-[34px] sm:px-5 text-deep_purple-800 text-center text-lg font-semibold bg-white-A700 min-w-[225px] rounded-[16px] sm:px-5 border border-deep_purple-800"
                                onClick={() => window.location.href = `/organizer-profile/${organizerid}`}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center px-6 py-2 h-[34px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[16px] sm:px-5 border border-deep_purple-800"
                                onClick={updateOrganizerProfile}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
