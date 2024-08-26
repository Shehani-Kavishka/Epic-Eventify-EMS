import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Text, Img, Button } from "../../components";
import HeaderAttendee from "components/HeaderAttendee";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from "components/Footer";

export default function DisplayEvent() {
  const [event,setEvent] = useState(null);
  const {eventid} = useParams();
  const {attendeeid} = useParams();
  
  useEffect(()=>{
    const fetchEvent = async () =>{
      try{
      console.log(`Fetching event with ID: ${eventid}`); 
      const response = await axios.get(`http://localhost:8080/event/${eventid}`)
    if (response.data.error) {
      console.log("No event found with this ID"); 
      setEvent(null); 
  } else {
      setEvent(response.data);
      console.log(response.data); 
  }
} catch (err) {
  console.log(err);
}
  };
  fetchEvent();  
  },[eventid]);

  if(!event){
    return <p>Loading...</p>;
}
else{
    console.log(event);
}
  return (
    <>
      <Helmet>
        <title>Display Events</title>
        <meta
          name="description"
        />
      </Helmet>
      
      <div className="flex w-full flex-col min-h-screen gap-8 bg-white-A700 pb-[100px] md:pb-5">
        
        <div>
          <HeaderAttendee attendeeid={attendeeid}/>
        </div>

        
        <div className="flex flex-col flex-grow items-end">
          
          <div className="mr-[25px] mt-[6px] flex w-[88%] flex-col items-start gap-[9px] md:mr-0 md:w-full md:p-5">
            {/* {event && ( */}
            <Text as="h1" size="2xl" className="font-bold text-center mx-auto md:ml-0" style={{fontWeight:'bold'}}>
              {event.eventname}
            </Text>

            {/* )} */}
            <div className="flex items-center gap-[46px] self-stretch md:flex-col">
              <Img
                src={event.eventimage}
                alt="eventimageone"
                className="h-[400px] w-[400px] object-cover md:w-full"
              />

              {/* event image section */}
              <div className="flex flex-1 flex-col gap-[67px] md:self-stretch sm:gap-[33px]">
                {/* event details row section */}
                <div className="flex items-center justify-between gap-5 sm:flex-col">
                  {/* event date time location section */}
                  <div className="flex flex-col items-start gap-[27px] self-end mt-10">
                    <div className="grid grid-cols-2 gap-x-4 w-full">
                      <Text size="xl" as="p" className="text-right leading-[2.5]">
                        Date: 
                      </Text>
                      <Text size="xl" as="p" className="leading-[2.5]">
                        {event.date}
                      </Text>
                      <Text size="xl" as="p" className="text-right leading-[2.5]">
                        Time: 
                      </Text>
                      <Text size="xl" as="p" className="leading-[2.5]">
                        {event.time}
                      </Text>
                      <Text size="xl" as="p" className="text-right leading-[2.5]">
                        Venue: 
                      </Text>
                      <Text size="xl" as="p" className="leading-[2.5]">
                        {event.venue}
                      </Text>
                      <Text size="xl" as="p" className="text-right leading-[2.5]">
                        Organized By: 
                      </Text>
                      <Text size="xl" as="p" className="leading-[2.5]">
                        {event.organizer}
                      </Text>
                    </div>
                  </div>

                  {/* event actions section */}

                  
                
                  
                </div>
                <div className="flex flex-col gap-[25px] md:w-full">
                  <Text size="xl" as="p" className="leading-6">
                    {event.description}
                  </Text>

                  <div className="flex gap-4 mt-4 ">

                    <Link className="flex-1">
                      <Button className="flex items-center justify-center h-[34px] px-[35px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[17px]">
                        Add to My List
                      </Button>
                    </Link>

                    <Link className="flex-1">
                      <Button className="flex items-center justify-center h-[34px] px-[35px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[17px]">
                        Buy Tickets
                      </Button>
                    </Link>                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
}
