import React from "react"
import {Text } from "components"
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () =>{
  return(
    <footer className="bg-white-A700 w-full p-6 mt-auto">
      <div className="flex-flex-col items-center">
        <div className="flex justify-center gap-9 text-[24px] mt-6 mb-4">
          {/* gap-[19px] justify-between */}
          <i className="fab fa-facebook h-[20px] w-[19px]"></i>
          <i className="fab fa-instagram h-[20px] w-[19px]"></i>
          <i className="fab fa-twitter h-[20px] w-[19px]"></i>
          <i className="fab fa-youtube h-[20px] w-[19px]"></i>
        </div>
        <Text size="md" as="p" className="!text-black-900 !font-poppins text-center mb-2">
          Home | About Us | Chats | My List | FAQs | Terms and Conditions | Privacy Policy
        </Text>
      </div>
    </footer>
  )
};

export default Footer;