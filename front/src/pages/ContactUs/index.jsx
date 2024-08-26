import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Text, Img } from "components";
import axios from "axios";

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        contactno: '',
        email: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const contactnopattern = /^(?:\+94|0)(?:(?:7[0-9]|9[0-8])\d{7}|[1-8]1\d{6}|[0-9]{2}\d{7})$/;

        if (!formData.fullname) {
            newErrors.fullname = "Full Name is required.";
        }
        if (!formData.contactno) {
            newErrors.contactno = "Contact No is required.";
        } else if (!contactnopattern.test(formData.contactno)) {
            newErrors.contactno = "Contact No is invalid.";
        }
        if (!formData.email) {
            newErrors.email = "Email Address is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email Address is invalid.";
        }
        if (!formData.subject) {
            newErrors.subject = "Subject is required.";
        }
        if (!formData.message) {
            newErrors.message = "Message is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://localhost:8080/api/contact', formData);
            if (response.data.success) {
                alert('Email sent successfully');
                setFormData({
                    fullname: '',
                    contactno: '',
                    email: '',
                    subject: '',
                    message: '',
                });
            } else {
                alert("Failed to send email");
            }
        } catch (error) {
            console.error("error sending email", error);
            alert("Error sending email");
        }
    };

    return (
        <>
            <Helmet>
                <title>Contact Us</title>
            </Helmet>
            <div className="flex w-full h-screen">
                <div className="flex items-center justify-center w-1/2 bg-deep_purple-800">
                    <Img
                        src="images/epiceventify.png"
                        alt="logo"
                        className="h-[135px] w-[300px] object-cover"
                    />
                </div>
                <div className="flex items-center justify-center w-1/2 bg-white p-10">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-lg space-y-6 border border-gray-300 p-8 rounded-lg shadow-lg"
                    >
                        <div className="space-y-4">
                            <Text as="p" size="lg" className="!text-blue_gray_800 font-semibold">
                                Full Name:
                            </Text>
                            <input
                                type="text"
                                name="fullname"
                                id="fullname"
                                placeholder="Your Full Name"
                                value={formData.fullname}
                                onChange={handleChange}
                                className={`w-full px-6 py-4 h-[30px] border border-gray-300 rounded-lg shadow-md bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-deep_purple-800 focus:border-transparent ${errors.fullname ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
                        </div>
                        <div className="space-y-4">
                            <Text as="p" size="lg" className="!text-blue_gray_800 font-semibold">
                                Contact No:
                            </Text>
                            <input
                                type="text"
                                name="contactno"
                                id="contactno"
                                placeholder="Your Contact No"
                                value={formData.contactno}
                                onChange={handleChange}
                                className={`w-full px-6 py-4 h-[30px] border border-gray-300 rounded-lg shadow-md bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-deep_purple-800 focus:border-transparent ${errors.contactno ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.contactno && <p className="text-red-500 text-sm">{errors.contactno}</p>}
                        </div>
                        <div className="space-y-4">
                            <Text as="p" size="lg" className="!text-blue_gray_800 font-semibold">
                                Email Address:
                            </Text>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Your Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-6 py-4 h-[30px] border border-gray-300 rounded-lg shadow-md bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-deep_purple-800 focus:border-transparent ${errors.email ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div className="space-y-4">
                            <Text as="p" size="lg" className="!text-blue_gray_800 font-semibold">
                                Subject:
                            </Text>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className={`w-full px-6 py-4 h-[30px] border border-gray-300 rounded-lg shadow-md bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-deep_purple-800 focus:border-transparent ${errors.subject ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
                        </div>
                        <div className="space-y-4">
                            <Text as="p" size="lg" className="!text-blue_gray_800 font-semibold">
                                Message:
                            </Text>
                            <textarea
                                name="message"
                                id="message"
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-deep_purple-800 focus:border-transparent ${errors.message ? 'border-red-500' : ''}`}
                                rows="4"
                                required
                            />
                            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                        </div>
                        <button
                            type="submit"
                            className="flex self-end items-center justify-center mt-16 h-[34px] px-[35px] sm:px-5 text-white-A700 text-center text-md font-semibold bg-deep_purple-800 min-w-[125px] rounded-[17px]"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ContactUsPage;
