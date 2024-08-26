import React from "react";
import { Img, Text } from "./..";
import { Link, useParams } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Header({ ...props }) {
  const { organizerid } = useParams();

  return (
    <header {...props}>
      <div className="w-full">
        <div>
          <div className="bg-white-A700">
            <div className="flex flex-col items-center justify-center">
              <div className="self-stretch z-[1]">
                <div className="flex sm:flex-col justify-between items-center gap-5 p-[26px] sm:p-5 bg-deep_purple-800 h-[90px]">
                  <div className="flex items-center">
                    <Img
                      src="http://localhost:3000/images/logo.png"
                      alt="logo"
                      className="h-[80px] w-[150px] mr-[20px] object-cover"
                      style={{ marginTop: '-16px' }}
                    />
                    
                    <div className="flex justify-center sm:flex-wrap">
                      <Link to={`/event-portal/${organizerid}`}>
                        <Text size="xl" as="p" className="!text-gray-200 text-center">
                          Events
                        </Text>
                      </Link>
                      <a href="Tickets" target="_blank" rel="noreferrer" className="ml-[33px]">
                        <Text size="xl" as="p" className="!text-gray-200 text-center">
                          Tickets
                        </Text>
                      </a>
                      <a href="Chats" target="_blank" rel="noreferrer" className="ml-[37px]">
                        <Text size="xl" as="p" className="!text-gray-200 text-center">
                          Chats
                        </Text>
                      </a>
                      <a href="About" target="_blank" rel="noreferrer" className="ml-[42px]">
                        <Text size="xl" as="p" className="!text-gray-200 text-center">
                          About
                        </Text>
                      </a>
                      <Link to={`/contact-us`}>
                        <Text size="xl" as="p" className="!text-gray-200 text-center ml-10">
                          Contact Us
                        </Text>
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center w-[14%] sm:w-full mr-[45px] gap-8 md:mr-0 text-[20px] !text-gray-200 mt-2">
                    <i className="fas fa-search h-[23px] w-[24px]"></i>
                    <i className="fas fa-bell h-[23px] w-[24px]"></i>
                    <Link to={`/organizer-profile/${organizerid}`}>
                      <i className="fas fa-user h-[23px] w-[24px]"></i>
                    </Link>
                    <Text size="xl" as="p" className="!text-gray-200 text-center ml-4">
                      Logout
                    </Text>
                  </div>
                </div>
                <div className="h-[2px] mt-[-2px] bg-deep_purple-800" />
                <div className="mt-[-2px]">
                  <div className="h-[2px] bg-blue_gray-100" />
                  <div className="h-[2px] mt-[-2px] bg-blue_gray-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
