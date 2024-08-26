import React from "react";
import { Text, Img, Button } from "./..";
import { Link } from "react-router-dom";

export default function OrganizerEventPortalRecentlyAddedColumnOne({
  eventid,
  eventimage,
  eventname,
  date,
  status,
  ...props
}) {
  return (
    <div {...props}>
      <div className="flex flex-col items-center w-full mb-[52px] gap-[26px] mx-auto md:p-5 max-w-[1100px]">
        <div className="flex justify-between w-[48%] md:w-full gap-5">        </div>
        <div className="flex flex-col self-stretch items-center gap-[35px]">
          <div className="flex flex-col self-stretch gap-[50px]">
            <div className="flex justify-center flex-1">
              <div className="flex md:flex-col justify-between items-start w-full gap-5 p-3 bg-white-A700 shadow-xs rounded-[15px]">
                <div className="flex justify-between items-center w-[38%] md:w-full gap-5">
                  
                  <div className="flex justify-center w-[54%]">
                    <Img
                      src={eventimage}
                      alt="event image"
                      className="h-[125px] w-full md:h-auto object-cover rounded-[20px]"
                    />
                    {/* </Link> */}
                  </div>
                  <div className="flex flex-col items-center gap-[15px]">
                    <Text size="xl" as="p" className="!text-black-900_01 text-center">
                      {eventname}
                    </Text>
                    <Text size="lg" as="p" className="!font-poppins text-justify">
                      {date}
                    </Text>
                    <Text size="xl" as="p" className="!text-black-900_01 text-center">
                      {status}
                    </Text>
                  </div>
                  
                </div>
                <div className="flex justify-center w-[50%] md:w-full mt-3.5 mr-[45px] md:mr-0">
                  <div className="flex flex-col w-full gap-[26px]">
                    <div className="flex justify-between gap-5">
                      <Link to={`/update-event/${eventid}`}>
                        <Button className="flex items-center justify-center h-[34px] px-[35px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[17px]">
                          Update
                        </Button>
                      </Link>
                      
                      <Link to={`/postpone-event/${eventid}`}>
                        <Button className="flex items-center justify-center h-[34px] px-[35px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[17px]">
                          Postpone
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="flex justify-between gap-5">
                      <Button className="flex items-center justify-center h-[34px] px-[35px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[17px]">
                      <Link to={`/cancel-event/${eventid}`}>
                        Cancel
                        </Link>
                      </Button>
                      <Button className="flex items-center justify-center h-[34px] px-[35px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[17px]">
                      <Link to={`/complete-event/${eventid}`}>
                        Complete
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
