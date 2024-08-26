import React from "react";
import { Text } from "components";
import { Img } from "components";

const AttndeeEventPortalEventTile = ({
  eventid,
  eventimage,
  eventname,
  date,
  time,
  venue,
  ...props
}) => {
  return (

    <div {...props} className={`${props.className} h-auto w-[360px] relative`}>
      <Img
        src={eventimage}
        alt="event image"
        // className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[200px] w-full object-cover"
        className="h-[200px] w-full object-cover rounded-[15px]"
      />
      <div className="bg-black bg-opacity-50 p-5 rounded-b-[15px]">
        <div className="flex flex-col items-start">
          <Text style={{fontSize:'24px', marginBottom:'20px', fontWeight:'bold'}}>
            {eventname}
          </Text>
          <Text as="p" style={{fontSize:'18px', marginBottom:'10px'}}>
            {date}
          </Text>
          <Text as="p" style={{fontSize:'18px', marginBottom:'10px'}}>
            {time}
          </Text>
          <Text as="p" style={{fontSize:'18px', marginBottom:'10px'}}>
            {venue}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default AttndeeEventPortalEventTile;
